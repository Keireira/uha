import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'db.db';

const getDbPath = () => `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

const getBackupPath = () => `${FileSystem.cacheDirectory}uha-backup-${Date.now()}.db`;

/**
 * Create a backup by checkpointing WAL and copying the database file.
 */
export const createBackup = async (): Promise<string> => {
	const dbPath = getDbPath();
	const backupPath = getBackupPath();

	// Checkpoint WAL to ensure all data is in the main db file
	const db = SQLite.openDatabaseSync(DB_NAME);
	db.execSync('PRAGMA wal_checkpoint(TRUNCATE);');

	await FileSystem.copyAsync({ from: dbPath, to: backupPath });

	return backupPath;
};

/**
 * Share a backup file via the system share sheet (Save to Files / iCloud Drive).
 */
export const shareBackup = async (): Promise<void> => {
	const backupPath = await createBackup();

	await Sharing.shareAsync(backupPath, {
		mimeType: 'application/x-sqlite3',
		dialogTitle: 'Save Uha Backup',
		UTI: 'public.database'
	});

	// Clean up temp file
	await FileSystem.deleteAsync(backupPath, { idempotent: true });
};

/**
 * Pick a backup file and restore it, replacing the current database.
 * Returns true on success.
 */
export const restoreFromBackup = async (): Promise<boolean> => {
	const result = await DocumentPicker.getDocumentAsync({
		type: '*/*',
		copyToCacheDirectory: true
	});

	if (result.canceled || !result.assets?.length) {
		return false;
	}

	const pickedUri = result.assets[0].uri;

	// Basic validation: check the file starts with SQLite magic bytes
	const valid = await validateSqliteFile(pickedUri);
	if (!valid) {
		throw new Error('Invalid backup file');
	}

	const dbPath = getDbPath();

	// Close current database connection
	const db = SQLite.openDatabaseSync(DB_NAME);
	db.closeSync();

	// Replace the database file
	await FileSystem.copyAsync({ from: pickedUri, to: dbPath });

	// Clean up picked file from cache
	await FileSystem.deleteAsync(pickedUri, { idempotent: true });

	return true;
};

/**
 * Share the raw SQLite database file (SQL export).
 */
export const shareSqlExport = async (): Promise<void> => {
	return shareBackup();
};

const validateSqliteFile = async (uri: string): Promise<boolean> => {
	try {
		// SQLite files start with "SQLite format 3\000"
		const content = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
			length: 16,
			position: 0
		});

		// "SQLite format 3\0" in base64 starts with "U1FMaXRl"
		return content.startsWith('U1FMaXRl');
	} catch {
		return false;
	}
};
