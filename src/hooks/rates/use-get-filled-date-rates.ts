import { useMemo } from 'react';

import db from '@db';
import { eq, desc } from 'drizzle-orm';
import { isAfterToday } from '@lib/date';
import { currencyRatesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { lightFormat } from 'date-fns';

const resolveDate = (date: string, lastKnownDate?: string) => {
	if (!isAfterToday(date)) return date;

	return lastKnownDate ?? '';
};

const useGetFilledDateRates = (date: Date | string) => {
	const formattedDate = lightFormat(date, 'yyyy-MM-dd');
	const {
		data: [lastKnown]
	} = useLiveQuery(
		db
			.select({ date: currencyRatesTable.date })
			.from(currencyRatesTable)
			.orderBy(desc(currencyRatesTable.date))
			.limit(1),
		[]
	);

	const targetDate = resolveDate(formattedDate, lastKnown?.date);
	const { data: rows = [] } = useLiveQuery(
		db.select().from(currencyRatesTable).where(eq(currencyRatesTable.date, targetDate)),
		[targetDate]
	);

	const rates = useMemo(() => new Map(rows.map((r) => [r.target_currency_id, r.rate])), [rows]);

	return rates;
};

export default useGetFilledDateRates;
