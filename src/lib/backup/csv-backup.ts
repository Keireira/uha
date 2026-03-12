import * as DocumentPicker from 'expo-document-picker';
import { parse, stringify } from '@vanillaes/csv';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite';
import { reloadAppAsync } from 'expo';
import { format } from 'date-fns';
import { map, reverse, keys, join, isEmpty } from 'ramda';
import JSZip from 'jszip';

import { DB_NAME, safeDelete } from './shared';

/** Raw DB row -- values can be any SQLite type. */
type DbRow = Record<string, unknown>;

/** Parsed CSV row -- values are always strings. */
type CsvRow = Record<string, string>;

/** Ordered parents-first for FK-safe INSERT; reverse for DELETE. */
const TABLES = [
	'categories',
	'currencies',
	'tenders',
	'services',
	'subscriptions',
	'price_history',
	'currency_rates',
	'transactions',
	'user'
] as const;

type TableName = (typeof TABLES)[number];

const toCsv = (rows: DbRow[]) => {
	if (isEmpty(rows)) return '';

	const cols = keys(rows[0]) as string[];
	const data = [cols, ...map((r) => map((c) => r[c] ?? '', cols), rows)];

	return stringify(data as string[][], { eof: false }) satisfies string;
};

const fromCsv = (text: string) => {
	const data = parse(text) as string[][];
	if (data.length < 2) return [];

	const [headers, ...rows] = data;

	return map(
		(values) => Object.fromEntries(map((i) => [headers[i], values[i] ?? ''], [...headers.keys()])),
		rows
	) satisfies CsvRow[];
};

const base64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)) satisfies Uint8Array;

// ---------------------------------------------------------------------------
// Zip <-> DB
// ---------------------------------------------------------------------------

const dumpToZip = async (db: SQLite.SQLiteDatabase) => {
	const zip = new JSZip();

	for (const table of TABLES) {
		const rows = await db.getAllAsync<DbRow>(`SELECT * FROM ${table}`);
		zip.file(`${table}.csv`, toCsv(rows));
	}

	return zip satisfies JSZip;
};

const parseBackupZip = async (zip: JSZip) => {
	const tableData = new Map<TableName, CsvRow[]>();

	for (const table of TABLES) {
		const file = zip.file(`${table}.csv`);
		if (!file) throw new Error(`Missing ${table}.csv in backup.`);

		const csvText = await file.async('string');
		tableData.set(table, fromCsv(csvText));
	}

	return tableData satisfies Map<TableName, CsvRow[]>;
};

const replaceAllData = (db: SQLite.SQLiteDatabase, tableData: Map<TableName, CsvRow[]>) => {
	db.withTransactionSync(() => {
		/* Reverse here because of foreign keys (we have to remove children first) */
		for (const table of reverse([...TABLES])) {
			db.runSync(`DELETE FROM ${table}`);
		}

		for (const table of TABLES) {
			const rows = tableData.get(table)!;
			if (isEmpty(rows)) continue;

			const columns = keys(rows[0]) as string[];
			const placeholders = join(',', map(() => '?', columns));
			const sql = `INSERT INTO ${table} (${join(',', columns)}) VALUES (${placeholders})`;

			for (const row of rows) {
				const values = map((col): string | null => {
					const v = row[col];
					return v === '' ? null : v;
				}, columns);

				db.runSync(sql, values);
			}
		}
	});
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Export all database tables as CSV files in a zip archive,
 * then open the system share sheet.
 */
export const shareCsvExport = async () => {
	const db = SQLite.openDatabaseSync(DB_NAME);
	const zip = await dumpToZip(db);

	const blob = await zip.generateAsync({ type: 'base64' });
	const timestamp = format(new Date(), 'dd-MMM-yyyy');
	const zipFile = new File(Paths.cache, `uha-export-${timestamp}.zip`);

	safeDelete(zipFile);
	zipFile.write(base64ToBytes(blob));

	try {
		await Sharing.shareAsync(zipFile.uri, {
			mimeType: 'application/zip',
			dialogTitle: 'Save Uha CSV Export',
			UTI: 'public.zip-archive'
		});
	} finally {
		safeDelete(zipFile);
	}
};

/**
 * Pick a CSV zip backup and restore the database from it.
 * Deletes all existing data (children first), then inserts (parents first).
 * Reloads the app on success.
 *
 * @returns `true` if restored, `false` if user cancelled.
 * @throws if the zip is missing required tables or contains invalid data.
 */
export const restoreFromCsvBackup = async () => {
	const result = await DocumentPicker.getDocumentAsync({
		type: 'application/zip',
		copyToCacheDirectory: true
	});

	if (result.canceled || !result.assets?.[0]) return false;

	const pickedFile = new File(result.assets[0].uri);

	try {
		const bytes = pickedFile.bytesSync();
		const zip = await JSZip.loadAsync(bytes);
		const tableData = await parseBackupZip(zip);

		const db = SQLite.openDatabaseSync(DB_NAME);
		replaceAllData(db, tableData);
	} finally {
		safeDelete(pickedFile);
	}

	await reloadAppAsync();

	return true;
};
