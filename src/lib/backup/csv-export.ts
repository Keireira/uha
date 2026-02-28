import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import db from '@db';
import {
	subscriptionsTable,
	transactionsTable,
	categoriesTable,
	tendersTable,
	priceHistoryTable
} from '@db/schema';

const escapeCSV = (value: string | number | boolean | null | undefined): string => {
	if (value === null || value === undefined) return '';
	const str = String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
};

const toCSV = (headers: string[], rows: Record<string, any>[]): string => {
	const headerLine = headers.map(escapeCSV).join(',');
	const dataLines = rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(','));
	return [headerLine, ...dataLines].join('\n');
};

const parseCSV = (text: string): Record<string, any>[] => {
	const lines = text.split('\n').filter((l) => l.length > 0);
	if (lines.length < 2) return [];

	const headers = parseCsvLine(lines[0]);
	return lines.slice(1).map((line) => {
		const values = parseCsvLine(line);
		const row: Record<string, any> = {};
		headers.forEach((h, i) => {
			row[h] = values[i] ?? '';
		});
		return row;
	});
};

const parseCsvLine = (line: string): string[] => {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (inQuotes) {
			if (ch === '"' && line[i + 1] === '"') {
				current += '"';
				i++;
			} else if (ch === '"') {
				inQuotes = false;
			} else {
				current += ch;
			}
		} else {
			if (ch === '"') {
				inQuotes = true;
			} else if (ch === ',') {
				result.push(current);
				current = '';
			} else {
				current += ch;
			}
		}
	}
	result.push(current);
	return result;
};

// Table definitions for export/import order
const TABLE_DEFS = [
	{
		name: 'categories',
		table: categoriesTable,
		headers: ['id', 'title', 'emoji', 'color']
	},
	{
		name: 'tenders',
		table: tendersTable,
		headers: ['id', 'title', 'is_card', 'comment', 'color', 'emoji']
	},
	{
		name: 'subscriptions',
		table: subscriptionsTable,
		headers: [
			'id',
			'service_id',
			'category_id',
			'custom_name',
			'billing_cycle_type',
			'billing_cycle_value',
			'current_price',
			'current_currency_id',
			'first_payment_date',
			'tender_id',
			'cancellation_date'
		]
	},
	{
		name: 'transactions',
		table: transactionsTable,
		headers: ['id', 'date', 'amount', 'currency_id', 'tender_id', 'subscription_id', 'is_phantom', 'comment']
	},
	{
		name: 'price_history',
		table: priceHistoryTable,
		headers: ['id', 'amount', 'date', 'currency_id', 'subscription_id']
	}
] as const;

/**
 * Export all user data tables to a single CSV file with section markers.
 * Format:
 * [table_name]
 * header1,header2,...
 * val1,val2,...
 *
 * [next_table]
 * ...
 */
export const exportAllCSV = async (): Promise<void> => {
	const sections: string[] = [];

	for (const def of TABLE_DEFS) {
		const rows = await db.select().from(def.table).all();
		const csv = toCSV([...def.headers], rows);
		sections.push(`[${def.name}]\n${csv}`);
	}

	const content = sections.join('\n\n');
	const path = `${FileSystem.cacheDirectory}uha-export-${Date.now()}.csv`;

	await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 });

	await Sharing.shareAsync(path, {
		mimeType: 'text/csv',
		dialogTitle: 'Export All Data'
	});

	await FileSystem.deleteAsync(path, { idempotent: true });
};

/**
 * Pick a CSV file and import it, replacing all existing user data.
 * Returns true on success.
 */
export const importAllCSV = async (): Promise<boolean> => {
	const result = await DocumentPicker.getDocumentAsync({
		type: ['text/csv', 'text/comma-separated-values', 'text/plain', '*/*'],
		copyToCacheDirectory: true
	});

	if (result.canceled || !result.assets?.length) {
		return false;
	}

	const pickedUri = result.assets[0].uri;
	const content = await FileSystem.readAsStringAsync(pickedUri, {
		encoding: FileSystem.EncodingType.UTF8
	});

	// Parse sections
	const sectionRegex = /\[(\w+)\]\n([\s\S]*?)(?=\n\[|\n*$)/g;
	const sections = new Map<string, string>();
	let match;

	while ((match = sectionRegex.exec(content)) !== null) {
		sections.set(match[1], match[2].trim());
	}

	if (sections.size === 0) {
		throw new Error('Invalid CSV file: no sections found');
	}

	// Delete in reverse order (children first) to respect FK constraints
	const deleteOrder = [...TABLE_DEFS].reverse();

	for (const def of deleteOrder) {
		if (sections.has(def.name)) {
			await db.delete(def.table);
		}
	}

	// Insert in forward order (parents first)
	for (const def of TABLE_DEFS) {
		const csv = sections.get(def.name);
		if (!csv) continue;

		const rows = parseCSV(csv);
		if (rows.length === 0) continue;

		for (const row of rows) {
			// Type coercion for known integer/boolean fields
			const coerced = coerceRow(def.name, row);
			await db.insert(def.table).values(coerced as any);
		}
	}

	await FileSystem.deleteAsync(pickedUri, { idempotent: true });
	return true;
};

const coerceRow = (tableName: string, row: Record<string, any>): Record<string, any> => {
	const result = { ...row };

	// Convert empty strings to null for nullable fields
	for (const [key, value] of Object.entries(result)) {
		if (value === '') {
			result[key] = null;
		}
	}

	switch (tableName) {
		case 'tenders':
			if (result.is_card != null) result.is_card = toBool(result.is_card);
			break;
		case 'subscriptions':
			if (result.billing_cycle_value != null) result.billing_cycle_value = toInt(result.billing_cycle_value);
			if (result.current_price != null) result.current_price = toInt(result.current_price);
			break;
		case 'transactions':
			if (result.amount != null) result.amount = toInt(result.amount);
			if (result.is_phantom != null) result.is_phantom = toBool(result.is_phantom);
			break;
		case 'price_history':
			if (result.amount != null) result.amount = parseFloat(result.amount);
			break;
	}

	return result;
};

const toBool = (v: any): boolean => v === 'true' || v === '1' || v === true;
const toInt = (v: any): number => parseInt(String(v), 10) || 0;
