import { useMemo } from 'react';
import { lightFormat } from 'date-fns';

import db from '@db';
import { and, eq, lte, desc } from 'drizzle-orm';
import { useSettingsValue } from './use-settings';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { currenciesTable, currencyRatesTable } from '@db/schema';

const useRates = (date: Date, isPhantom: boolean, txCurrencyCode: string) => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const [rate, usdRate] = useMemo(() => {
		const whereClause = (code: string) =>
			and(
				eq(currencyRatesTable.target_currency_id, code),
				isPhantom
					? lte(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
					: eq(currencyRatesTable.date, lightFormat(date, 'yyyy-MM-dd'))
			);

		const result = db
			.select()
			.from(currencyRatesTable)
			.where(whereClause(recalcCurrencyCode))
			.orderBy(desc(currencyRatesTable.date))
			.limit(1)
			.get();

		const usdResult = db
			.select()
			.from(currencyRatesTable)
			.where(whereClause(txCurrencyCode))
			.orderBy(desc(currencyRatesTable.date))
			.limit(1)
			.get();

		return [result?.rate, usdResult?.rate];
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [date, recalcCurrencyCode]);

	const formatCurrency = (value: number, currency_code = txCurrencyCode) => {
		const recalc = db.select().from(currenciesTable).where(eq(currenciesTable.id, currency_code)).get();

		if (!recalc) {
			return `${currency_code} ${value}`;
		}

		try {
			return new Intl.NumberFormat(recalc.intl_locale, {
				style: 'currency',
				currency: recalc.id,
				currencyDisplay: 'symbol',
				minimumFractionDigits: recalc.fraction_digits,
				maximumFractionDigits: recalc.fraction_digits
			}).format(value);
			/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
		} catch (_) {
			return `${recalc.symbol}${value.toFixed(recalc.fraction_digits)}`;
		}
	};

	const { data: recalcCurrency } = useLiveQuery(
		db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)),
		[recalcCurrencyCode]
	);

	const getRates = (value: number) => {
		const recalc = Array.isArray(recalcCurrency) ? recalcCurrency[0] : recalcCurrency;

		const priceUsd = (rate || 1) / (usdRate || 1);
		const price = value * priceUsd;

		return formatCurrency(price, recalc?.id);
	};

	return {
		r: getRates,
		formatCurrency,
		hasAnyRate: Boolean(rate && usdRate)
	};
};

export default useRates;
