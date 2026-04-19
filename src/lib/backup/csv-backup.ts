import { File, Directory, Paths } from 'expo-file-system';
import { map, reverse, keys, join, isEmpty } from 'ramda';
import * as DocumentPicker from 'expo-document-picker';
import { parse, stringify } from '@vanillaes/csv';
import * as Sharing from 'expo-sharing';
import * as SQLite from 'expo-sqlite';
import { reloadAppAsync } from 'expo';
import { format } from 'date-fns';

import { zip, unzip } from '@modules/cloud-backup';
import { DB_NAME, safeDelete, toPath } from './shared';

type DbRow = Record<string, unknown>;
type CsvRow = Record<string, string>;

const TABLES = [
	'categories',
	'currencies',
	'tenders',
	'services',
	'subscriptions',
	'timeline_events',
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

const getTempDir = (name: string) => {
	const dir = new Directory(Paths.cache, name);
	if (dir.exists) dir.delete();
	dir.create();
	return dir;
};

// ---------------------------------------------------------------------------
// Zip <-> DB
// ---------------------------------------------------------------------------

const dumpToDir = async (db: SQLite.SQLiteDatabase, dir: Directory) => {
	for (const table of TABLES) {
		const rows = await db.getAllAsync<DbRow>(`SELECT * FROM ${table}`);
		const file = new File(dir, `${table}.csv`);
		file.write(toCsv(rows));
	}
};

const parseCsvDir = async (dir: Directory) => {
	const tableData = new Map<TableName, CsvRow[]>();

	for (const table of TABLES) {
		const file = new File(dir, `${table}.csv`);
		if (!file.exists) throw new Error(`Missing ${table}.csv in backup.`);

		tableData.set(table, fromCsv(await file.text()));
	}

	return tableData;
};

const replaceAllData = (db: SQLite.SQLiteDatabase, tableData: Map<TableName, CsvRow[]>) => {
	db.withTransactionSync(() => {
		for (const table of reverse([...TABLES])) {
			db.runSync(`DELETE FROM ${table}`);
		}

		for (const table of TABLES) {
			const rows = tableData.get(table)!;
			if (isEmpty(rows)) continue;

			const columns = keys(rows[0]) as string[];
			const singlePlaceholder = `(${join(
				',',
				map(() => '?', columns)
			)})`;

			const batches = [];
			for (let i = 0; i < rows.length; i += 150) {
				batches.push(rows.slice(i, i + 150));
			}

			for (const batch of batches) {
				const allPlaceholders = join(
					',',
					map(() => singlePlaceholder, batch)
				);
				const sql = `INSERT INTO ${table} (${join(',', columns)}) VALUES ${allPlaceholders}`;

				const values = batch.flatMap((row) =>
					map((col): string | null => {
						const v = row[col];
						return v === '' ? null : v;
					}, columns)
				);

				db.runSync(sql, values);
			}
		}
	});
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const shareCsvExport = async () => {
	const db = SQLite.openDatabaseSync(DB_NAME);
	const csvDir = getTempDir('csv-export');
	const timestamp = format(new Date(), 'dd-MMM-yyyy');
	const zipFile = new File(Paths.cache, `uha-export-${timestamp}.zip`);

	safeDelete(zipFile);

	try {
		await dumpToDir(db, csvDir);
		await zip(toPath(csvDir.uri), toPath(zipFile.uri));

		await Sharing.shareAsync(zipFile.uri, {
			mimeType: 'application/zip',
			dialogTitle: 'Save Uha CSV Export',
			UTI: 'public.zip-archive'
		});
	} finally {
		if (csvDir.exists) csvDir.delete();
		safeDelete(zipFile);
	}
};

export const restoreFromCsvBackup = async () => {
	const result = await DocumentPicker.getDocumentAsync({
		type: 'application/zip',
		copyToCacheDirectory: true
	});

	if (result.canceled || !result.assets?.[0]) return false;

	const pickedFile = new File(result.assets[0].uri);
	const csvDir = getTempDir('csv-restore');

	try {
		await unzip(toPath(pickedFile.uri), toPath(csvDir.uri));
		const tableData = await parseCsvDir(csvDir);

		const db = SQLite.openDatabaseSync(DB_NAME);
		replaceAllData(db, tableData);
	} finally {
		safeDelete(pickedFile);
		if (csvDir.exists) csvDir.delete();
	}

	await reloadAppAsync();

	return true;
};
