import React, { useMemo } from 'react';

import { useGetCurrency, formatCurrency } from '@hooks/rates';
import { useSettingsValue, useGetFilledDateRates } from '@hooks';

import Root, { DateText, TotalText } from './header-card.styles';

import type { HeaderSectionT } from '../../txs-list.d';

const HeaderCard = ({ date, rawDate, txs }: HeaderSectionT) => {
	const rates = useGetFilledDateRates(rawDate);

	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const recalcCurrency = useGetCurrency(recalcCurrencyCode);

	const totalSum = useMemo(() => {
		if (txs.length <= 1 || !recalcCurrency) return null;

		let total = 0;
		const toRate = rates.get(recalcCurrency.id) || 1;

		for (const tx of txs) {
			const fromRate = rates.get(tx.currency_code) || 1;
			const denominator = tx.denominator || 1;

			total += (tx.price / denominator / fromRate) * toRate;
		}

		return formatCurrency(total, recalcCurrency);
	}, [recalcCurrency, txs, rates]);

	return (
		<Root>
			<DateText>{date}</DateText>
			{totalSum ? <TotalText>{totalSum}</TotalText> : null}
		</Root>
	);
};

export default React.memo(HeaderCard);
