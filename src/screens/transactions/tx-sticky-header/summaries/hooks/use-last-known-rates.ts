import { useEffect, useState } from 'react';

import db from '@db';
import { eq, desc } from 'drizzle-orm';
import { currencyRatesTable } from '@db/schema';

const useGetLastKnownRates = (day: string, monthStart: string, yearStart: string) => {
	const [rates, setRates] = useState<Map<string, number>>(new Map());

	useEffect(() => {
		const execute = async () => {
			const lastKnownRate = await db
				.select()
				.from(currencyRatesTable)
				.orderBy(desc(currencyRatesTable.date))
				.limit(1)
				.get();

			const allRatesForDate = await db
				.select()
				.from(currencyRatesTable)
				.where(eq(currencyRatesTable.date, lastKnownRate?.date ?? ''))
				.all();

			const nextRates = new Map<string, number>();

			for (const rate of allRatesForDate) {
				nextRates.set(rate.target_currency_id, rate.rate);
			}

			setRates(nextRates);
		};

		execute();
	}, [day, monthStart, yearStart]);

	return rates;
};

export default useGetLastKnownRates;
