import { useEffect } from 'react';
import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { lightFormat, startOfToday, startOfTomorrow } from 'date-fns';

import { withRetry } from '@lib';
import { getHistoryRates } from '@api/sharkie';

import { lt, sql } from 'drizzle-orm';
import db, { silentDb, uhaDb } from '@db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currenciesTable, currencyRatesTable, transactionsTable } from '@db/schema';

/**
 * Today's rate acts as the baseline `lastKnownRates` used by summaries and
 * `useGetFilledDateRates` whenever a tx falls outside the per-month range
 * (e.g. scheduled future billings). Without it a fresh user with only
 * future-dated subscriptions ends up with an empty `currency_rates` table,
 * collapsing every conversion to 1:1 (`$25` → `25 ₸`).
 */
const todayStr = () => lightFormat(startOfToday(), 'yyyy-MM-dd');

type BackfillRatesOptionsT = {
	refetchExisting?: boolean;
};

type InsertRateItemT = {
	id: string;
	target_currency_id: string;
	date: string;
	rate: number;
};

const getRateDates = ({ refetchExisting = false }: BackfillRatesOptionsT = {}) => {
	const txs = db
		.select({
			date: transactionsTable.date,
			currency_id: transactionsTable.currency_id
		})
		.from(transactionsTable)
		.where(lt(transactionsTable.date, startOfTomorrow().toISOString()))
		.all();

	const dates = new Set<string>();
	const existingDatesDb = db.select({ date: currencyRatesTable.date }).from(currencyRatesTable).all();
	const existingDates = new Set(existingDatesDb.map((r) => r.date));

	// Always guarantee today's rate exists — see `todayStr` comment above.
	const today = todayStr();
	if (refetchExisting || !existingDates.has(today)) {
		dates.add(today);
	}

	for (const tx of txs) {
		const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

		if (!refetchExisting && existingDates.has(formattedDate)) {
			continue;
		}

		dates.add(formattedDate);
	}

	return Array.from(dates);
};

export const backfillRates = async (
	options: BackfillRatesOptionsT = {}
): Promise<{ success: boolean; fetchedCount: number }> => {
	const newDates = getRateDates(options);

	if (!newDates.length) {
		return {
			success: true,
			fetchedCount: 0
		};
	}

	const responses = [];
	const valuesToInsert = [];
	const splitted = splitEvery(10, newDates);

	for (const dates of splitted) {
		responses.push(await withRetry(() => getHistoryRates(dates)));
	}

	const knownCurrencyIds = new Set(
		db
			.select({ id: currenciesTable.id })
			.from(currenciesTable)
			.all()
			.map((c) => c.id)
	);

	for (const response of responses) {
		for (const entry of response.data) {
			if (__DEV__) {
				console.log(
					`\x1b[34m[BACKFILL RATES]:\x1b[0m Rate entry for: \x1b[33m${entry.date}\x1b[0m has been \x1b[32mDOWNLOADED\x1b[0m`
				);
			}

			const values = Object.entries(entry.rates).reduce((acc, [target_currency_id, rate]) => {
				if (knownCurrencyIds.has(target_currency_id)) {
					acc.push({
						id: Crypto.randomUUID(),
						target_currency_id,
						date: entry.date,
						rate
					});
				}

				return acc;
			}, [] as InsertRateItemT[]);

			valuesToInsert.push(...values);
		}
	}

	const batches = splitEvery(150, valuesToInsert);

	await silentDb.transaction(async (tx) => {
		for (const batch of batches) {
			await tx
				.insert(currencyRatesTable)
				.values(batch)
				.onConflictDoUpdate({
					target: [currencyRatesTable.target_currency_id, currencyRatesTable.date],
					set: { rate: sql`excluded.rate` }
				})
				.execute();
		}
	});

	uhaDb.runSync('UPDATE currency_rates SET rate = rate WHERE rowid = (SELECT MIN(rowid) FROM currency_rates)');

	return {
		success: true,
		fetchedCount: valuesToInsert.length
	};
};

const useBackfillRates = () => {
	const { t } = useTranslation();

	const { data: txs } = useLiveQuery(
		db
			.select({
				date: transactionsTable.date,
				currency_id: transactionsTable.currency_id
			})
			.from(transactionsTable)
			.where(lt(transactionsTable.date, startOfTomorrow().toISOString()))
	);

	const existingDatesDb = db.select({ date: currencyRatesTable.date }).from(currencyRatesTable).all();
	const existingDates = new Set(existingDatesDb.map((r) => r.date));

	const newDates: string[] = [];
	const seen = new Set<string>();

	// Always include today — otherwise a user with only future-dated txs
	// (or no txs at all on a fresh install) would never trigger the
	// effect, and the rates table would stay empty.
	const today = todayStr();
	if (!existingDates.has(today)) {
		newDates.push(today);
		seen.add(today);
	}

	for (const tx of txs) {
		const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

		if (existingDates.has(formattedDate) || seen.has(formattedDate)) {
			continue;
		}

		newDates.push(formattedDate);
		seen.add(formattedDate);
	}

	useEffect(() => {
		if (!newDates.length) return;

		backfillRates().catch((err) => {
			console.log(err);

			Toast.show({
				type: 'error',
				text1: t('rates.error.title'),
				text2: t('rates.error.description')
			});
		});
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [newDates.length]);
};

export default useBackfillRates;
