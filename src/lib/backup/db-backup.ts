import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { reloadAppAsync } from 'expo';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';

import { SQLITE_MAGIC, DB_NAME, safeDelete } from './shared';

export const getDbFile = () => {
	return new File(Paths.document, 'SQLite', DB_NAME);
};

export const createBackupFile = () => {
	const timestamp = format(new Date(), 'dd-MMM-yyyy');

	return new File(Paths.cache, `uha-backup-${timestamp}.db`);
};

/**
 * Validate that a file starts with the SQLite magic header.
 * Uses FileHandle to read only the first 15 bytes instead of the entire file.
 */
export const validateSqliteFile = (file: File) => {
	try {
		const handle = file.open();

		try {
			const bytes = handle.readBytes(SQLITE_MAGIC.length);
			const header = new TextDecoder().decode(bytes);

			return header === SQLITE_MAGIC;
		} finally {
			handle.close();
		}
	} catch {
		return false;
	}
};

/**
 * Checkpoint WAL and copy the database to a temporary backup file.
 * Caller is responsible for cleaning up the returned file.
 */
export const createBackup = () => {
	const db = SQLite.openDatabaseSync(DB_NAME);

	try {
		db.execSync('PRAGMA wal_checkpoint(TRUNCATE);');
	} finally {
		db.closeSync();
	}

	const backupFile = createBackupFile();
	safeDelete(backupFile);
	getDbFile().copy(backupFile);

	return backupFile;
};

/**
 * Share a backup file via the system share sheet (Save to Files / iCloud Drive).
 */
export const shareDbBackup = async () => {
	const backupFile = createBackup();

	try {
		await Sharing.shareAsync(backupFile.uri, {
			mimeType: 'application/x-sqlite3',
			dialogTitle: 'Save Uha Backup',
			UTI: 'public.database'
		});
	} finally {
		safeDelete(backupFile);
	}
};

/**
 * Pick a backup file and restore it, replacing the current database.
 * Closes the db connection, replaces the file + WAL/SHM, then reloads the app.
 *
 * @returns true if restored successfully, false if the user cancelled.
 * @throws if the picked file is not a valid SQLite database.
 */
export const restoreFromDbBackup = async () => {
	const result = await DocumentPicker.getDocumentAsync({
		type: '*/*',
		copyToCacheDirectory: true
	});

	if (result.canceled) return false;

	const asset = result.assets?.[0];
	if (!asset) return false;

	// DocumentPicker copies to the app's Inbox dir, use the URI it gives us
	const pickedFile = new File(asset.uri);

	if (!validateSqliteFile(pickedFile)) {
		safeDelete(pickedFile);
		throw new Error('Invalid backup file: not a valid SQLite database.');
	}

	// We can't reliably close the app's db connection from here (held by SQLiteProvider).
	// On iOS/macOS, unlinking an open file is fine — the fd stays valid until the process
	// releases it, and reloadAppAsync() kills the JS context right after.
	const dbFile = getDbFile();
	safeDelete(new File(dbFile.uri + '-wal'));
	safeDelete(new File(dbFile.uri + '-shm'));
	safeDelete(dbFile);

	try {
		pickedFile.copy(getDbFile());
	} finally {
		safeDelete(pickedFile);
	}

	// Full app reload to re-init db connection and all in-memory state
	await reloadAppAsync();

	return true;
};
