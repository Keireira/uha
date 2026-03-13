import { createBackup, fetchBackup } from '@modules/cloud-backup';
import { File, Paths } from 'expo-file-system';
import { reloadAppAsync } from 'expo';
import JSZip from 'jszip';
import { getDbFile, validateSqliteFile, createBackup as createLocalBackup } from './db-backup';
import { DB_NAME, SQLITE_MAGIC, safeDelete } from './shared';

const toPath = (uri: string) => uri.replace(/^file:\/\//, '');

const withTempFile = async <T>(name: string, fn: (file: File) => Promise<T>) => {
	const file = new File(Paths.cache, name);

	try {
		return await fn(file);
	} finally {
		safeDelete(file);
	}
};

const compressDb = async (dbFile: File) => {
	const zip = new JSZip();
	zip.file(DB_NAME, await dbFile.arrayBuffer());

	return zip.generateAsync({
		type: 'uint8array',
		compression: 'DEFLATE',
		compressionOptions: { level: 9 }
	});
};

const decompressDb = async (buffer: ArrayBuffer) => {
	const zip = await JSZip.loadAsync(buffer);
	const entry = zip.file(DB_NAME);

	if (!entry) {
		throw new Error(`Invalid CloudKit backup: missing ${DB_NAME} in archive.`);
	}

	return entry.async('uint8array');
};

const validateMagicHeader = (bytes: Uint8Array) => {
	const header = new TextDecoder().decode(bytes.slice(0, SQLITE_MAGIC.length));

	if (header !== SQLITE_MAGIC) {
		throw new Error('Invalid CloudKit backup: not a valid SQLite database.');
	}
};

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

	try {
		const zipBytes = await compressDb(backupFile);

		await withTempFile('cloudkit-backup.db', async (tmp) => {
			tmp.write(zipBytes);
			await createBackup(toPath(tmp.uri));
		});

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

	const rawBytes = await new File(backupFilePath).arrayBuffer();
	const bytes = await decompressDb(rawBytes);
	console.log(`[iCloud] ✓ Decompressed → ${Math.round(bytes.length / 1024)} KB`);

	validateMagicHeader(bytes);
	console.log('[iCloud] ✓ SQLite header valid');

	await withTempFile('cloudkit-restore.db', async (tmp) => {
		tmp.write(bytes);

		if (!validateSqliteFile(tmp)) {
			throw new Error('Invalid CloudKit backup: file validation failed.');
		}

		replaceDbFile(tmp);
	});

	await reloadAppAsync();
	return true;
};
