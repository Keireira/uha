import { useEffect } from 'react';
import { splitEvery } from 'ramda';
import { lightFormat, startOfTomorrow } from 'date-fns';
import { getHistoryRates } from '@api/sharkie';

import db from '@db';
import { lt } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currencyRatesTable, transactionsTable } from '@db/schema';

const useBackfillRates = () => {
	const { data: txs } = useLiveQuery(
		db
			.select({
				date: transactionsTable.date,
				currency_id: transactionsTable.currency_id
			})
			.from(transactionsTable)
			// where date is before today
			.where(lt(transactionsTable.date, startOfTomorrow().toISOString()))
	);

	useEffect(() => {
		const datesByCurrency = new Map<string, string[]>();

		for (const tx of txs) {
			const formattedDate = lightFormat(new Date(tx.date), 'yyyy-MM-dd');

			if (!datesByCurrency.has(tx.currency_id)) {
				datesByCurrency.set(tx.currency_id, []);
			}

			datesByCurrency.get(tx.currency_id)?.push(formattedDate);
		}

		const currencies = Array.from(datesByCurrency.keys());
		const dates = Array.from(datesByCurrency.values()).flat();
		const uniqueDates = [...new Set(dates)];

		if (uniqueDates.length > 0 && currencies.length > 0) {
			const splitted = splitEvery(5, uniqueDates);

			for (const dates of splitted) {
				getHistoryRates(dates).then((response) => {
					for (const rate of response.data) {
						console.log(rate.date, rate.rates);
					}
				});
			}
		}
	}, [txs]);
};

export default useBackfillRates;
