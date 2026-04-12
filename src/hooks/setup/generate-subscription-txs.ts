import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { eq, asc } from 'drizzle-orm';
import { useSettingsValue } from '@hooks';
import { advanceDate } from '@hooks/use-transactions/utils';
import { lightFormat, startOfToday, addYears, endOfYear } from 'date-fns';

import db, { silentDb, uhaDb } from '@db';
import { subscriptionsTable, transactionsTable, priceHistoryTable } from '@db/schema';

import type { TransactionT, SubscriptionT } from '@models';

type PriceEntry = { amount: number; date: string; currency_id: string };

const buildTxsForSubscription = (
	subscription: SubscriptionT,
	horizon: Date,
	priceHistory: PriceEntry[]
): TransactionT[] => {
	let nextDate = new Date(subscription.first_payment_date);
	const cancellation = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

	if (cancellation && cancellation < horizon) {
		return [];
	}

	const txs: TransactionT[] = [];
	let priceIdx = -1;

	while (nextDate < horizon) {
		const txDateStr = lightFormat(nextDate, 'yyyy-MM-dd');

		// Advance pointer to last applicable price_history entry
		while (priceIdx + 1 < priceHistory.length && priceHistory[priceIdx + 1].date <= txDateStr) {
			priceIdx++;
		}

		if (priceIdx < 0) {
			// No price_history entry covers this date — skip
			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
			continue;
		}

		const entry = priceHistory[priceIdx];

		txs.push({
			id: Crypto.randomUUID(),
			amount: entry.amount,
			date: nextDate.toISOString(),
			currency_id: entry.currency_id,
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

	const allPriceHistory = await db
		.select()
		.from(priceHistoryTable)
		.orderBy(asc(priceHistoryTable.subscription_id), asc(priceHistoryTable.date));

	const priceHistoryBySubId = new Map<string, PriceEntry[]>();
	for (const ph of allPriceHistory) {
		const list = priceHistoryBySubId.get(ph.subscription_id) ?? [];
		list.push({ amount: ph.amount, date: ph.date, currency_id: ph.currency_id });
		priceHistoryBySubId.set(ph.subscription_id, list);
	}

	const allTxs = subscriptions.flatMap((sub) =>
		buildTxsForSubscription(sub, horizon, priceHistoryBySubId.get(sub.id) ?? [])
	);
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

		const priceHistory = await db
			.select()
			.from(priceHistoryTable)
			.where(eq(priceHistoryTable.subscription_id, subscription.id))
			.orderBy(asc(priceHistoryTable.date));

		const priceEntries = priceHistory.map((ph) => ({
			amount: ph.amount,
			date: ph.date,
			currency_id: ph.currency_id
		}));

		await insertTxs(buildTxsForSubscription(subscription, horizon, priceEntries));
	};

	return generateSubscriptionTxs;
};

export default useGenerateTxs;
