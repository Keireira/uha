import React from 'react';
import { useRates, useSettingsValue } from '@hooks';

import Root, { BasePrice, ConvertedPrice } from './price.styles';

import type { Props } from './price.d';

const Price = ({ date, isPhantom, currencyCode, price, denominator }: Props) => {
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const { r, formatCurrency, hasAnyRate } = useRates(date, isPhantom, currencyCode);

	const withConversion = currencyCode !== recalcCurrencyCode;

	const basePrice = price / (denominator || 1);
	const formattedBasePrice = formatCurrency(basePrice, currencyCode);
	const convertedPrice = r(basePrice);

	if (!hasAnyRate) {
		return null;
	}

	return (
		<Root $withConversion={withConversion}>
			<BasePrice>{formattedBasePrice}</BasePrice>

			{withConversion && <ConvertedPrice>≈&nbsp;{convertedPrice}</ConvertedPrice>}
		</Root>
	);
};

export default Price;
