import { createBackup, fetchBackup } from '@modules/cloud-backup';
import { File } from 'expo-file-system';
import { reloadAppAsync } from 'expo';

import { safeDelete } from './shared';
import { getDbFile, validateSqliteFile, createBackup as createLocalBackup } from './db-backup';

const toPath = (uri: string) => uri.replace(/^file:\/\//, '');

const replaceDbFile = (validatedTempFile: File) => {
	const dbFile = getDbFile();

	safeDelete(new File(dbFile.uri + '-wal'));
	safeDelete(new File(dbFile.uri + '-shm'));
	safeDelete(dbFile);

	validatedTempFile.copy(getDbFile());
};

/**
 * Checkpoint WAL, compress with zip and upload to CloudKit.
 */
export const backupToCloudKit = async (): Promise<void> => {
	const backupFile = await createLocalBackup();
	console.log(`DB size: ${(backupFile.size / 1024 / 1024).toFixed(2)} MB`);

	try {
		await createBackup(toPath(backupFile.uri));

		console.log('[iCloud] ✓ Backup complete');
	} catch (err) {
		console.error('[iCloud] ✗ Backup failed:', err);
	} finally {
		safeDelete(backupFile);
	}
};

/**
 * Restore the database from the latest CloudKit backup.
 *
 * @returns true if restored, false if no backup found.
 * @throws if the backup data is not a valid SQLite database.
 */
export const restoreFromCloudKit = async (): Promise<boolean> => {
	console.log('[iCloud] ☁ Starting restore...');

	const backupFilePath = await fetchBackup();

	if (!backupFilePath) {
		console.log('[iCloud] ◆ No backup found');
		return false;
	}

	const backupFile = new File(backupFilePath);

	if (!validateSqliteFile(backupFile)) {
		throw new Error('Invalid CloudKit backup');
	}

	replaceDbFile(backupFile);

	await reloadAppAsync();
	return true;
};
