import React from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { useAppModel } from '@models';
import { useSettingsValue } from '@hooks';
import { useSummaryAnimations } from '../../hooks';

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

const SummaryBlock = ({ clavis, total, formattedDate, categories, isDisabled }: Props) => {
	const { t } = useTranslation();
	const { view_mode, tx_dates } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);
	const isTerminationView = useUnit(tx_dates.is_termination_view.$value);
	const animations = useSummaryAnimations();
	const showFractions = useSettingsValue<boolean>('currency_fractions');

	const isListMode = viewMode === 'list';
	const isCalendarMode = viewMode === 'calendar';
	const title = isListMode ? formattedDate : t(`dates.${clavis}`);

	return (
		<Root style={animations.summary} $isDisabled={isDisabled}>
			<Text $bold>
				{total > 0 && !(isTerminationView && isCalendarMode)
					? total.toLocaleString('en-US', {
							style: 'currency',
							/* @TODO: add support of real currency */
							currency: 'USD',
							maximumFractionDigits: total > 1000 || !showFractions ? 0 : 2
						})
					: '—'}
			</Text>

			<DateText>{title}</DateText>

			<CategoryChips style={animations.categoryChips}>
				{/* For the sake of smooth animation */}
				{isListMode && renderCategoryChips(categories, total, clavis)}
			</CategoryChips>
		</Root>
	);
};

export default React.memo(SummaryBlock);
