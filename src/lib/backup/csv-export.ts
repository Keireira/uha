import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import db from '@db';
import { subscriptionsTable, transactionsTable } from '@db/schema';

const escapeCSV = (value: string | number | null | undefined): string => {
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

export const exportSubscriptionsCSV = async (): Promise<void> => {
	const subs = await db.select().from(subscriptionsTable).all();

	const headers = [
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
	];

	const csv = toCSV(headers, subs);
	const path = `${FileSystem.cacheDirectory}uha-subscriptions-${Date.now()}.csv`;

	await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

	await Sharing.shareAsync(path, {
		mimeType: 'text/csv',
		dialogTitle: 'Export Subscriptions'
	});

	await FileSystem.deleteAsync(path, { idempotent: true });
};

export const exportTransactionsCSV = async (): Promise<void> => {
	const txs = await db.select().from(transactionsTable).all();

	const headers = [
		'id',
		'subscription_id',
		'date',
		'amount',
		'currency_id',
		'tender_id',
		'is_paid',
		'notes'
	];

	const csv = toCSV(headers, txs);
	const path = `${FileSystem.cacheDirectory}uha-transactions-${Date.now()}.csv`;

	await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

	await Sharing.shareAsync(path, {
		mimeType: 'text/csv',
		dialogTitle: 'Export Transactions'
	});

	await FileSystem.deleteAsync(path, { idempotent: true });
};
