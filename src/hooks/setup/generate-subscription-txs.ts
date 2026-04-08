import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { useSettingsValue } from '@hooks';
import { advanceDate } from '@hooks/use-transactions/utils';
import { startOfToday, addYears, endOfYear } from 'date-fns';

import db, { silentDb, uhaDb } from '@db';
import { subscriptionsTable, transactionsTable } from '@db/schema';

import type { TransactionT, SubscriptionT } from '@models';

const buildTxsForSubscription = (subscription: SubscriptionT, horizon: Date): TransactionT[] => {
	let nextDate = new Date(subscription.first_payment_date);
	const cancellation = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

	if (cancellation && cancellation < horizon) {
		return [];
	}

	const txs: TransactionT[] = [];

	while (nextDate < horizon) {
		txs.push({
			id: Crypto.randomUUID(),
			amount: subscription.current_price,
			date: nextDate.toISOString(),
			currency_id: subscription.current_currency_id,
			tender_id: subscription.tender_id || '',
			subscription_id: subscription.id,
			comment: ''
		});

		nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
	}

	return txs;
};

const insertTxs = async (txs: TransactionT[]) => {
	if (txs.length === 0) return;

	const batches = splitEvery(150, txs);

	for (const batch of batches) {
		await db.insert(transactionsTable).values(batch);
	}
};

export const regenerateAllTxs = async (maxHorizonYears: number) => {
	const today = startOfToday();
	const horizon = endOfYear(addYears(today, maxHorizonYears));

	const subscriptions = await db.select().from(subscriptionsTable);

	const allTxs = subscriptions.flatMap((sub) => buildTxsForSubscription(sub, horizon));
	const batches = splitEvery(150, allTxs);

	/*
	 * Write through silent connection (no change listener) to avoid ~1000 useLiveQuery re-runs
	 * that block the JS thread for 18+ seconds
	 */
	await silentDb.transaction(async (tx) => {
		await tx.delete(transactionsTable);

		for (const batch of batches) {
			await tx.insert(transactionsTable).values(batch);
		}
	});

	/*
	 * Single touch through the main (listener-enabled) connection
	 * to trigger exactly one useLiveQuery refresh
	 */
	uhaDb.runSync('UPDATE transactions SET comment = comment WHERE rowid = (SELECT MIN(rowid) FROM transactions)');
};

export const useGenerateTxs = () => {
	const maxHorizon = useSettingsValue<number>('max_horizon');

	const generateSubscriptionTxs = async (subscription: SubscriptionT) => {
		const today = startOfToday();
		const horizon = endOfYear(addYears(today, maxHorizon));

		await insertTxs(buildTxsForSubscription(subscription, horizon));
	};

	return generateSubscriptionTxs;
};

export default useGenerateTxs;
