import React from 'react';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { eq } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useSummaryAnimations } from '../../hooks';
import { useSettingsValue, useSearchParams } from '@hooks';

import { Text } from '@ui';
import Root, { DateText, CategoryChip, CategoryChips } from './summary-block.styles';

import type { Props } from './summary-block.d';
import type { CategoryT } from '../../summaries.d';

const renderCategoryChips = (categories: CategoryT[], total: Props['total'], clavis: Props['clavis']) => {
	const categoryChips = categories.map((category) => {
		const percentage = (category.amount / total) * 100;

		return (
			<CategoryChip key={`chip_${clavis}_${category.id}`} style={{ width: `${percentage}%` }} $color={category.color} />
		);
	});

	return categoryChips;
};

const SummaryBlock = ({ clavis, total, formattedDate, categories, isDisabled, onPress }: Props) => {
	const { t } = useTranslation();
	const { txViewMode } = useSearchParams();
	const animations = useSummaryAnimations();
	const showFractions = useSettingsValue<boolean>('currency_fractions');
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const {
		data: [currency]
	} = useLiveQuery(db.select().from(currenciesTable).where(eq(currenciesTable.id, recalcCurrencyCode)).limit(1), [
		recalcCurrencyCode
	]);

	return (
		<Root style={animations.summary} $isDisabled={isDisabled} onTouchEnd={onPress}>
			<Text $bold>
				{total > 0 && currency
					? total.toLocaleString(currency.intl_locale, {
							style: 'currency',
							currency: currency.id,
							currencyDisplay: 'symbol',
							minimumFractionDigits: total > 1000 || !showFractions ? 0 : currency.fraction_digits,
							maximumFractionDigits: total > 1000 || !showFractions ? 0 : currency.fraction_digits
						})
					: '—'}
			</Text>

			<DateText>{txViewMode === 'list' ? formattedDate : t(`dates.${clavis}`)}</DateText>

			<CategoryChips style={animations.categoryChips}>
				{/* For the sake of smooth animation */}
				{txViewMode === 'list' && renderCategoryChips(categories, total, clavis)}
			</CategoryChips>
		</Root>
	);
};

export default React.memo(SummaryBlock);
