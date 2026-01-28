import { useEffect, useMemo } from 'react';
import { splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { getHistoryRates } from '@api/sharkie';
import { lightFormat, startOfTomorrow } from 'date-fns';

import db from '@db';
import { lt, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currencyRatesTable, transactionsTable } from '@db/schema';

const BASE_CURRENCY = 'USD';

const useBackfillRates = () => {
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
		if (!newDates.length) return;

		const splitted = splitEvery(10, newDates);
		const promises = [];

		for (const dates of splitted) {
			promises.push(getHistoryRates(dates));
		}

		Promise.all(promises).then((responses) => {
			const valueToInsert = [];

			for (const response of responses) {
				for (const entry of response.data) {
					const values = Object.entries(entry.rates).map(([target_currency_id, rate]) => ({
						id: Crypto.randomUUID(),
						base_currency_id: BASE_CURRENCY,
						target_currency_id,
						date: entry.date,
						rate
					}));

					valueToInsert.push(...values);
				}
			}

			/* because of sqlite limit on the number of parameters in a single query */
			const batches = splitEvery(150, valueToInsert);

			db.transaction(async (tx) => {
				for (const batch of batches) {
					await tx
						.insert(currencyRatesTable)
						.values(batch)
						.onConflictDoUpdate({
							target: [
								currencyRatesTable.base_currency_id,
								currencyRatesTable.target_currency_id,
								currencyRatesTable.date
							],
							set: { rate: sql`excluded.rate` }
						})
						.execute();
				}
			}).catch(console.error);
		});
	}, [newDates]);
};

export default useBackfillRates;
