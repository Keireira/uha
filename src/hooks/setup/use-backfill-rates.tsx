import { useEffect } from 'react';
import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { lightFormat, startOfTomorrow } from 'date-fns';

import { withRetry } from '@lib';
import { getHistoryRates } from '@api/sharkie';

import db from '@db';
import { lt, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currencyRatesTable, transactionsTable } from '@db/schema';

const getMissingDates = () => {
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

	for (const tx of txs) {
		const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

		if (existingDates.has(formattedDate)) {
			continue;
		}

		dates.add(formattedDate);
	}

	return Array.from(dates);
};

export const backfillRates = async (): Promise<{ success: boolean; fetchedCount: number }> => {
	const newDates = getMissingDates();

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

			valuesToInsert.push(...values);
		}
	}

	const batches = splitEvery(150, valuesToInsert);

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

	for (const tx of txs) {
		const formattedDate = lightFormat(tx.date, 'yyyy-MM-dd');

		if (existingDates.has(formattedDate)) {
			continue;
		}

		newDates.push(formattedDate);
	}

	useEffect(() => {
		if (!newDates.length) return;

		backfillRates().catch(() => {
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
