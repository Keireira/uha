import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { eq, asc } from 'drizzle-orm';
import { useSettingsValue } from '@hooks';
import { advanceDate } from '@hooks/use-transactions/utils';
import { lightFormat, startOfToday, addYears, endOfYear } from 'date-fns';

import db, { silentDb, uhaDb } from '@db';
import { subscriptionsTable, transactionsTable, timelineEventsTable } from '@db/schema';

import type { TransactionT, SubscriptionT } from '@models';

/**
 * Parse a 'YYYY-MM-DD' date into a *local* midnight Date so that it round-trips
 * cleanly through `lightFormat(date, 'yyyy-MM-dd')`. Using `new Date('2026-04-19')`
 * would parse as UTC midnight and, in UTC-negative timezones, format back to the
 * previous day — which would cause the first billing tx to be silently skipped.
 */
const parseLocalDate = (iso: string): Date => {
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, m - 1, d);
};

type TimelineEventRow = typeof timelineEventsTable.$inferSelect;

type PriceEntry = { amount: number; date: string; currency_id: string };

/** A half-open pause window [start, end). `end=null` means "still paused". */
type PauseWindow = { start: string; end: string | null };

type BuildParamsT = {
	subscription: SubscriptionT;
	horizon: Date;
	events: TimelineEventRow[];
};

const isInsidePauseWindow = (dateStr: string, windows: PauseWindow[]): boolean =>
	windows.some((w) => dateStr >= w.start && (w.end == null || dateStr < w.end));

/** Priced events sorted chronologically — drives billing amount per cycle. */
const derivePriceHistory = (events: TimelineEventRow[]): PriceEntry[] =>
	events
		.filter(
			(e) =>
				(e.type === 'first_payment' || e.type === 'price_up' || e.type === 'price_down') &&
				e.amount != null &&
				e.currency_id != null
		)
		.map((e) => ({ amount: e.amount as number, date: e.date, currency_id: e.currency_id as string }))
		.sort((a, b) => a.date.localeCompare(b.date));

/**
 * Collapse pause/resume events into half-open [start, end) windows. A trailing
 * pause without a matching resume keeps `end = null` — billing is suppressed
 * from then on.
 */
const derivePauseWindows = (events: TimelineEventRow[]): PauseWindow[] => {
	const windows: PauseWindow[] = [];
	const ordered = [...events]
		.filter((e) => e.type === 'pause' || e.type === 'resume')
		.sort((a, b) => a.date.localeCompare(b.date));

	let openStart: string | null = null;
	for (const e of ordered) {
		if (e.type === 'pause' && openStart == null) {
			openStart = e.date;
		} else if (e.type === 'resume' && openStart != null) {
			windows.push({ start: openStart, end: e.date });
			openStart = null;
		}
	}
	if (openStart != null) windows.push({ start: openStart, end: null });
	return windows;
};

const deriveRefunds = (events: TimelineEventRow[]): PriceEntry[] =>
	events
		.filter((e) => e.type === 'refund' && e.amount != null && e.currency_id != null)
		.map((e) => ({ amount: e.amount as number, date: e.date, currency_id: e.currency_id as string }));

const buildTxsForSubscription = ({ subscription, horizon, events }: BuildParamsT): TransactionT[] => {
	const txs: TransactionT[] = [];

	const priceHistory = derivePriceHistory(events);
	const pauseWindows = derivePauseWindows(events);
	const refunds = deriveRefunds(events);

	const cancellation = subscription.cancellation_date
		? parseLocalDate(subscription.cancellation_date)
		: null;

	// Scheduled billing transactions — bail per-iteration when we hit cancellation
	// or pause windows, not at the outer level.
	let nextDate = parseLocalDate(subscription.first_payment_date);
	let priceIdx = -1;

	while (nextDate < horizon) {
		if (cancellation && nextDate >= cancellation) break;

		const txDateStr = lightFormat(nextDate, 'yyyy-MM-dd');

		// Advance pointer to last applicable priced timeline event.
		while (priceIdx + 1 < priceHistory.length && priceHistory[priceIdx + 1].date <= txDateStr) {
			priceIdx++;
		}

		if (priceIdx < 0) {
			// No priced timeline event covers this date yet — skip.
			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
			continue;
		}

		if (isInsidePauseWindow(txDateStr, pauseWindows)) {
			nextDate = advanceDate(
				nextDate,
				subscription.billing_cycle_type,
				subscription.billing_cycle_value
			);
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

	// Standalone refund transactions — emitted with negative amounts so the
	// running balance reflects the money-returned event.
	for (const refund of refunds) {
		txs.push({
			id: Crypto.randomUUID(),
			amount: -Math.abs(refund.amount),
			date: parseLocalDate(refund.date).toISOString(),
			currency_id: refund.currency_id,
			tender_id: subscription.tender_id || '',
			subscription_id: subscription.id,
			comment: 'refund'
		});
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

	const allEvents = await db
		.select()
		.from(timelineEventsTable)
		.orderBy(asc(timelineEventsTable.subscription_id), asc(timelineEventsTable.date));

	const eventsBySubId = new Map<string, TimelineEventRow[]>();
	for (const ev of allEvents) {
		const list = eventsBySubId.get(ev.subscription_id) ?? [];
		list.push(ev);
		eventsBySubId.set(ev.subscription_id, list);
	}

	const allTxs = subscriptions.flatMap((sub) =>
		buildTxsForSubscription({
			subscription: sub,
			horizon,
			events: eventsBySubId.get(sub.id) ?? []
		})
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
		// Guard against the settings cache not being hydrated yet — `addYears(date, undefined)`
		// returns Invalid Date, which would collapse the billing loop to zero iterations.
		const horizonYears = typeof maxHorizon === 'number' && Number.isFinite(maxHorizon) ? maxHorizon : 2;
		const horizon = endOfYear(addYears(today, horizonYears));

		const events = await db
			.select()
			.from(timelineEventsTable)
			.where(eq(timelineEventsTable.subscription_id, subscription.id))
			.orderBy(asc(timelineEventsTable.date));

		await insertTxs(
			buildTxsForSubscription({
				subscription,
				horizon,
				events
			})
		);
	};

	return generateSubscriptionTxs;
};

export default useGenerateTxs;
