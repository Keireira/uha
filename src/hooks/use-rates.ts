import { useMemo } from 'react';
import { lightFormat } from 'date-fns';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { and, eq, lte, desc } from 'drizzle-orm';
import { useSettingsValue } from './use-settings';
import { currenciesTable, currencyRatesTable } from '@db/schema';

const useRates = (date: Date, isPhantom: boolean, txCurrencyCode: string) => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const [rate, usdRate] = useMemo(() => {
		const result = db
			.select()
			.from(currencyRatesTable)
			.where(
				and(
					eq(currencyRatesTable.target_currency_id, recalcCurrencyCode),
					isPhantom
						? lte(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
						: eq(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
				)
			)
			.orderBy(desc(currencyRatesTable.date))
			.limit(1)
			.get();

		const usdResult = db
			.select()
			.from(currencyRatesTable)
			.where(
				and(
					eq(currencyRatesTable.target_currency_id, txCurrencyCode),
					isPhantom
						? lte(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
						: eq(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
				)
			)
			.orderBy(desc(currencyRatesTable.date))
			.limit(1)
			.get();

		return [result?.rate, usdResult?.rate];
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [date, recalcCurrencyCode]);

	const { data: recalcCurrency } = useLiveQuery(
		db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)),
		[recalcCurrencyCode]
	);

	const getRates = (value: number) => {
		const recalc = Array.isArray(recalcCurrency) ? recalcCurrency[0] : recalcCurrency;

		const priceUsd = (rate || 1) / (usdRate || 1);
		const price = value * priceUsd;

		if (!recalc) {
			return price;
		}

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: recalc.id,
			currencyDisplay: 'symbol',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price);
	};

	return {
		r: getRates
	};
};

export default useRates;
