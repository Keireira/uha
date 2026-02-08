import { useEffect, useMemo } from 'react';
import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { getHistoryRates } from '@api/sharkie';
import { lightFormat, startOfTomorrow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import db from '@db';
import { lt, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currencyRatesTable, transactionsTable } from '@db/schema';

const withRetry = async <T,>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn();
		} catch (error) {
			if (i === attempts - 1) throw error;
			await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
		}
	}

	throw new Error('withRetry: unreachable');
};

const getMissingDates = () => {
	const txs = db
		.select({
			date: transactionsTable.date,
			currency_id: transactionsTable.currency_id
		})
		.from(transactionsTable)
		.where(lt(transactionsTable.date, startOfTomorrow().toISOString()))
		.all();

	const existingDatesDb = db.select({ date: currencyRatesTable.date }).from(currencyRatesTable).all();
	const existingDates = new Set(existingDatesDb.map((r) => r.date));

	const dates = new Set<string>();

	for (const tx of txs) {
		const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

		if (existingDates.has(formattedDate)) continue;

		dates.add(formattedDate);
	}

	return Array.from(dates);
};

export const backfillRates = async (): Promise<{ success: boolean; fetchedCount: number }> => {
	const newDates = getMissingDates();

	if (!newDates.length) {
		return { success: true, fetchedCount: 0 };
	}

	const splitted = splitEvery(10, newDates);
	const promises = splitted.map((dates) => withRetry(() => getHistoryRates(dates)));

	const responses = await Promise.all(promises);
	const valueToInsert = [];

	for (const response of responses) {
		for (const entry of response.data) {
			if (__DEV__) {
				console.log(
					`\x1b[34m[BACKFILL RATES]:\x1b[0m Rate entry for: \x1b[33m${entry.date}\x1b[0m has been \x1b[32mDOWNLOADED\x1b[0m`
				);
			}

			const values = Object.entries(entry.rates).map(([target_currency_id, rate]) => ({
				id: Crypto.randomUUID(),
				target_currency_id,
				date: entry.date,
				rate
			}));

			valueToInsert.push(...values);
		}
	}

	/* because of sqlite limit on the number of parameters in a single query */
	const batches = splitEvery(150, valueToInsert);

	await db.transaction(async (tx) => {
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

	return { success: true, fetchedCount: valueToInsert.length };
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

	const newDates = useMemo(() => {
		const dates = new Set<string>();
		const existingDatesDb = db.select({ date: currencyRatesTable.date }).from(currencyRatesTable).all();
		const existingDates = new Set(existingDatesDb.map((r) => r.date));

		for (const tx of txs) {
			const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

			if (existingDates.has(formattedDate)) continue;

			dates.add(formattedDate);
		}

		return Array.from(dates);
	}, [txs]);

	useEffect(() => {
		if (!newDates.length) {
			return;
		}

		backfillRates().catch(() => {
			Toast.show({
				type: 'error',
				text1: t('rates.error_title'),
				text2: t('rates.error_description')
			});
		});
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [newDates]);
};

export default useBackfillRates;
