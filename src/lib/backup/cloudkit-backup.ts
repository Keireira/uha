import { iCloud } from 'react-native-icloud-kit';
import { File, Paths } from 'expo-file-system';
import { reloadAppAsync } from 'expo';
import * as SQLite from 'expo-sqlite';

import { SQLITE_MAGIC, DB_NAME, safeDelete } from './shared';
import { getDbFile, validateSqliteFile } from './db-backup';

const RECORD_TYPE = 'DatabaseBackup';
const RECORD_ID = 'latest-backup';

const bytesToBase64 = (bytes: Uint8Array): string => {
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
};

const base64ToBytes = (b64: string): Uint8Array => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/**
 * Check whether iCloud is available (user signed in).
 */
export const isICloudAvailable = async (): Promise<boolean> => {
	try {
		return await iCloud.isAvailable();
	} catch {
		return false;
	}
};

/**
 * Get the last CloudKit backup metadata (timestamp), or null if none exists.
 */
export const getLastBackupInfo = async (): Promise<{ timestamp: number } | null> => {
	try {
		const records = await iCloud.query(RECORD_TYPE, undefined, 1);

		if (records.length === 0) return null;

		const ts = records[0].fields.timestamp;
		return ts != null ? { timestamp: Number(ts) } : null;
	} catch {
		return null;
	}
};

/**
 * Backup the database to CloudKit.
 * Checkpoints WAL, reads the db file, encodes as base64, and saves as a CloudKit record.
 */
export const backupToCloudKit = async (): Promise<void> => {
	const db = SQLite.openDatabaseSync(DB_NAME);

	try {
		db.execSync('PRAGMA wal_checkpoint(TRUNCATE);');
	} finally {
		db.closeSync();
	}

	const dbFile = getDbFile();
	const bytes = dbFile.bytesSync();
	const data = bytesToBase64(bytes);

	await iCloud.save(
		RECORD_TYPE,
		{
			data,
			timestamp: Date.now(),
			version: 1
		},
		RECORD_ID
	);
};

/**
 * Restore the database from the latest CloudKit backup.
 *
 * @returns true if restored, false if no backup found.
 * @throws if the backup data is not a valid SQLite database.
 */
export const restoreFromCloudKit = async (): Promise<boolean> => {
	const records = await iCloud.query(RECORD_TYPE, undefined, 1);

	if (records.length === 0) return false;

	const data = records[0].fields.data;
	if (typeof data !== 'string') {
		throw new Error('Invalid CloudKit backup: missing data field.');
	}

	const bytes = base64ToBytes(data);

	// Validate the magic header before writing anything
	const header = new TextDecoder().decode(bytes.slice(0, SQLITE_MAGIC.length));
	if (header !== SQLITE_MAGIC) {
		throw new Error('Invalid CloudKit backup: not a valid SQLite database.');
	}

	// Write to a temp file, validate, then replace the db
	const tempFile = new File(Paths.cache, 'cloudkit-restore.db');
	safeDelete(tempFile);
	tempFile.write(bytes);

	if (!validateSqliteFile(tempFile)) {
		safeDelete(tempFile);
		throw new Error('Invalid CloudKit backup: file validation failed.');
	}

	const dbFile = getDbFile();
	safeDelete(new File(dbFile.uri + '-wal'));
	safeDelete(new File(dbFile.uri + '-shm'));
	safeDelete(dbFile);

	try {
		tempFile.copy(getDbFile());
	} finally {
		safeDelete(tempFile);
	}

	await reloadAppAsync();

	return true;
};
