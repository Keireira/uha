import { useEffect, useState } from 'react';

import db from '@db';
import { eq, desc } from 'drizzle-orm';
import { isAfterToday } from '@lib/date';
import { currencyRatesTable } from '@db/schema';

import { lightFormat } from 'date-fns';

const resolveDate = (date: string): string => {
	if (!isAfterToday(date)) return date;

	const lastKnown = db
		.select({ date: currencyRatesTable.date })
		.from(currencyRatesTable)
		.orderBy(desc(currencyRatesTable.date))
		.limit(1)
		.get();

	return lastKnown?.date ?? '';
};

const fetchRatesMap = (date: string): Map<string, number> => {
	const rows = db.select().from(currencyRatesTable).where(eq(currencyRatesTable.date, date)).all();

	return new Map(rows.map((r) => [r.target_currency_id, r.rate]));
};

const useGetFilledDateRates = (date: Date | string) => {
	const formattedDate = lightFormat(date, 'yyyy-MM-dd');
	const [rates, setRates] = useState<Map<string, number>>(new Map());

	useEffect(() => {
		const targetDate = resolveDate(formattedDate);

		setRates(fetchRatesMap(targetDate));
	}, [formattedDate]);

	return rates;
};

export default useGetFilledDateRates;
