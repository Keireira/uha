import { iCloud } from 'react-native-icloud-kit';
import { File, Paths } from 'expo-file-system';
import { reloadAppAsync } from 'expo';
import * as SQLite from 'expo-sqlite';
import { formatISO } from 'date-fns';
import { join, range, splitEvery } from 'ramda';
import JSZip from 'jszip';

import { getDbFile, createBackup, validateSqliteFile } from './db-backup';
import { RECORD_TYPE, RECORD_ID, DB_NAME, SQLITE_MAGIC, safeDelete } from './shared';

/**
 * CloudKit string fields have a ~1MB limit.
 * We use 666KB chunks to stay safely under the per-record request limit
 * (base64 overhead + field metadata).
 */
const CHUNK_SIZE = 666_000;
const MAX_CHUNKS = 8;
const CHUNK_RECORD_TYPE = 'DatabaseBackupChunk';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const chunkRecordId = (index: number) => `${RECORD_ID}-chunk-${index}`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Save with retry and backoff for transient CloudKit network errors. */
const saveWithRetry = async (...args: Parameters<typeof iCloud.save>) => {
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			return await iCloud.save(...args);
		} catch (err) {
			const isLastAttempt = attempt === MAX_RETRIES - 1;
			if (isLastAttempt) throw err;

			console.warn(
				`[iCloud] ⚠ Save failed — retry ${attempt + 1}/${MAX_RETRIES} in ${(RETRY_DELAY * (attempt + 1)) / 1000}s`
			);
			await delay(RETRY_DELAY * (attempt + 1));
		}
	}
};

/** Compress db bytes into a base64 zip string. */
const compressToBase64 = async (bytes: Uint8Array): Promise<string> => {
	const zip = new JSZip();
	zip.file(DB_NAME, bytes);

	return zip.generateAsync({
		type: 'base64',
		compression: 'DEFLATE',
		compressionOptions: { level: 9 }
	});
};

/** Split a string into chunks and return as array of { data, index } records. */
const toChunks = (data: string): string[] => splitEvery(CHUNK_SIZE, data);

/** Get previous manifest's totalChunks, or 0 if none exists. */
const getPreviousChunkCount = async (): Promise<number> => {
	try {
		const records = await iCloud.query(RECORD_TYPE, undefined, 1);
		const count = records[0]?.fields?.totalChunks;

		return typeof count === 'number' ? count : 0;
	} catch {
		return 0;
	}
};

/**
 * Strip currency_rates from a backup file to reduce size.
 * Opens the file as a separate db, deletes the table, and vacuums.
 */
const stripCurrencyRates = (backupFile: File) => {
	const cacheDir = Paths.cache.uri.replace(/^file:\/\//, '');
	const tempDb = SQLite.openDatabaseSync(backupFile.name, {}, cacheDir);

	try {
		tempDb.execSync('DELETE FROM currency_rates; VACUUM;');
	} finally {
		tempDb.closeSync();
	}
};

/**
 * Backup the database to CloudKit.
 * Checkpoints WAL, compresses with zip, splits into chunks if needed,
 * and saves to CloudKit. Strips currency_rates if backup exceeds MAX_CHUNKS.
 */
export const backupToCloudKit = async (): Promise<void> => {
	const backupFile = createBackup();

	try {
		console.log('[iCloud] ☁ Starting backup...');

		let data = await compressToBase64(backupFile.bytesSync());

		// If the payload is too large, strip currency rates and recompress
		if (Math.ceil(data.length / CHUNK_SIZE) > MAX_CHUNKS) {
			console.warn('[iCloud] ⚠ Payload too large — stripping currency_rates to reduce size');
			stripCurrencyRates(backupFile);
			data = await compressToBase64(backupFile.bytesSync());
		}

		const previousChunkCount = await getPreviousChunkCount();
		const chunks = toChunks(data);
		const totalChunks = chunks.length;

		console.log(
			`[iCloud] ◆ Compressed: ${Math.round(data.length / 1024)} KB → ${totalChunks} chunk${totalChunks > 1 ? 's' : ''}`
		);

		// Save chunk records
		for (let i = 0; i < totalChunks; i++) {
			const kb = Math.round(chunks[i].length / 1024);
			console.log(`[iCloud] ↑ Uploading chunk [${i + 1}/${totalChunks}] — ${kb} KB`);
			await saveWithRetry(CHUNK_RECORD_TYPE, { data: chunks[i], index: i }, chunkRecordId(i));
		}

		console.log('[iCloud] ✓ All chunks uploaded');

		// Save manifest
		const manifest = {
			timestamp: formatISO(new Date()),
			totalChunks,
			version: 1
		};
		console.log(`[iCloud] ↑ Saving manifest — ${totalChunks} chunks, v${manifest.version}`);
		await saveWithRetry(RECORD_TYPE, manifest, RECORD_ID);
		console.log('[iCloud] ✓ Manifest saved');

		// Clean up stale chunks from a previous larger backup
		if (previousChunkCount > totalChunks) {
			const staleCount = previousChunkCount - totalChunks;
			console.log(`[iCloud] ✂ Cleaning up ${staleCount} stale chunk${staleCount > 1 ? 's' : ''}...`);
			const staleIndexes = range(totalChunks, previousChunkCount);
			await deleteChunks(staleIndexes);
		}

		console.log('[iCloud] ✓ Backup complete');
	} catch (err) {
		console.error('[iCloud] ✗ Backup failed:', err);
	} finally {
		safeDelete(backupFile);
	}
};

/** Delete chunk records by their indexes. */
const deleteChunks = async (indexes: number[]) => {
	for (const i of indexes) {
		try {
			await iCloud.delete(CHUNK_RECORD_TYPE, chunkRecordId(i));
			console.log(`[iCloud] ✂ Deleted stale chunk ${i + 1}`);
		} catch (err) {
			console.warn(`[iCloud] ⚠ Failed to delete chunk ${i + 1}:`, err);
		}
	}
};

/** Reassemble all chunks into a single base64 string. */
const reassembleChunks = async (totalChunks: number): Promise<string> => {
	console.log(`[iCloud] ↓ Downloading ${totalChunks} chunk${totalChunks > 1 ? 's' : ''}...`);
	const records = await iCloud.query(CHUNK_RECORD_TYPE, undefined, totalChunks);

	if (records.length < totalChunks) {
		throw new Error(`Invalid CloudKit backup: expected ${totalChunks} chunks, got ${records.length}.`);
	}

	const sorted = records.sort((a, b) => (a.fields.index as number) - (b.fields.index as number));

	return sorted.map((r) => {
		const data = r.fields.data;
		if (typeof data !== 'string') {
			throw new Error(`Invalid CloudKit backup: missing data in chunk ${r.fields.index}.`);
		}
		return data;
	}).join('');
};

/** Decompress a base64 zip string into raw db bytes. */
const decompressFromBase64 = async (data: string): Promise<Uint8Array> => {
	const zip = await JSZip.loadAsync(data, { base64: true });
	const dbEntry = zip.file(DB_NAME);

	if (!dbEntry) {
		throw new Error('Invalid CloudKit backup: missing db.db in archive.');
	}

	return dbEntry.async('uint8array');
};

/** Validate that bytes start with the SQLite magic header. */
const validateMagicHeader = (bytes: Uint8Array) => {
	const header = new TextDecoder().decode(bytes.slice(0, SQLITE_MAGIC.length));

	if (header !== SQLITE_MAGIC) {
		throw new Error('Invalid CloudKit backup: not a valid SQLite database.');
	}
};

/** Replace the current database file with new bytes, then reload the app. */
const replaceDbAndReload = async (bytes: Uint8Array) => {
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
};

/**
 * Restore the database from the latest CloudKit backup.
 *
 * @returns true if restored, false if no backup found.
 * @throws if the backup data is not a valid SQLite database.
 */
export const restoreFromCloudKit = async (): Promise<boolean> => {
	console.log('[iCloud] ☁ Starting restore...');

	const records = await iCloud.query(RECORD_TYPE, undefined, 1);

	if (records.length === 0) {
		console.log('[iCloud] ◆ No backup found');
		return false;
	}

	const { totalChunks, version } = records[0].fields;

	if (version !== 1 || typeof totalChunks !== 'number') {
		throw new Error('Invalid CloudKit backup: unsupported version.');
	}

	console.log(`[iCloud] ◆ Found backup: ${totalChunks} chunk${totalChunks > 1 ? 's' : ''}, v${version}`);

	const data = await reassembleChunks(totalChunks);
	console.log(`[iCloud] ✓ Reassembled ${Math.round(data.length / 1024)} KB`);

	const bytes = await decompressFromBase64(data);
	console.log(`[iCloud] ✓ Decompressed → ${Math.round(bytes.length / 1024)} KB`);

	validateMagicHeader(bytes);
	console.log('[iCloud] ✓ SQLite header valid');

	await replaceDbAndReload(bytes);

	return true;
};
