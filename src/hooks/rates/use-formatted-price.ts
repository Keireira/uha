import { useMemo } from 'react';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';

import { useSettingsValue } from '@hooks';
import useGetFilledDateRates from './use-get-filled-date-rates';

import type { CurrencyT } from '@models';

export const formatCurrency = (value: number, currency?: CurrencyT) => {
	if (!currency) {
		return value.toFixed(2);
	}

	try {
		return new Intl.NumberFormat(currency.intl_locale, {
			style: 'currency',
			currency: currency.id,
			currencyDisplay: 'symbol',
			minimumFractionDigits: currency.fraction_digits,
			maximumFractionDigits: currency.fraction_digits
		}).format(value);
	} catch {
		return value.toFixed(2);
	}
};

export const useGetCurrency = (currencyCode: CurrencyT['id'] = 'USD') => {
	const currency = useMemo(() => {
		return db.select().from(currenciesTable).where(eq(currenciesTable.id, currencyCode)).get();
	}, [currencyCode]);

	return currency;
};

const convertPrice = (
	rawPrice: number,
	from: CurrencyT | undefined,
	to: CurrencyT | undefined,
	rates: Map<string, number>
) => {
	const basePrice = rawPrice / (from?.denominator || 1);
	const fromRate = rates.get(from?.id ?? 'USD') || 1;
	const toRate = rates.get(to?.id ?? 'USD') || 1;

	return {
		base: basePrice,
		converted: (basePrice / fromRate) * toRate
	};
};

const useFormattedPrice = (date: Date | string, rawPrice: number, baseCurrencyCode: CurrencyT['id']) => {
	const rates = useGetFilledDateRates(date);
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const currency = useGetCurrency(baseCurrencyCode);
	const recalcCurrency = useGetCurrency(recalcCurrencyCode);

	const prices = convertPrice(rawPrice, currency, recalcCurrency, rates);

	return {
		withConversion: currency?.id !== recalcCurrency?.id,
		basePrice: formatCurrency(prices.base, currency),
		convertedPrice: formatCurrency(prices.converted, recalcCurrency)
	};
};

export default useFormattedPrice;
