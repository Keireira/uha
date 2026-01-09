import React from 'react';
import { useYear, useMonth, useSummariesQuery, useSummaryAnimation } from './hooks';

import { useSettingsValue } from '@hooks';

import { Text } from '@ui';
import Root, { SummaryItem, CategoryChips, CategoryChip } from './summaries.styles';

const Summaries = () => {
	const animations = useSummaryAnimation();
	const transactions = useSummariesQuery();
	const showFractions = useSettingsValue<boolean>('currency_fractions');

	const year = useYear(transactions);
	const month = useMonth(transactions);

	return (
		<Root>
			<SummaryItem style={animations.summary}>
				<Text $bold>
					{month.total.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
						maximumFractionDigits: month.total > 1000 || !showFractions ? 0 : 2
					})}
				</Text>

				<Text $color="#666">{month.formattedDate}</Text>

				<CategoryChips style={animations.categoryChips}>
					{month.categories.map((category) => {
						const percentage = (category.amount / month.total) * 100;

						return (
							<CategoryChip
								key={`chip_month_${category.id}`}
								style={{ width: `${percentage}%` }}
								$color={category.color}
							/>
						);
					})}
				</CategoryChips>
			</SummaryItem>

			<SummaryItem style={animations.summary}>
				<Text $bold>
					{year.total.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
						maximumFractionDigits: year.total > 1000 || !showFractions ? 0 : 2
					})}
				</Text>

				<Text $color="#666">{year.formattedDate}</Text>

				<CategoryChips style={animations.categoryChips}>
					{year.categories.map((category) => {
						const percentage = (category.amount / year.total) * 100;

						return (
							<CategoryChip
								key={`chip_year_${category.id}`}
								style={{ width: `${percentage}%` }}
								$color={category.color}
							/>
						);
					})}
				</CategoryChips>
			</SummaryItem>
		</Root>
	);
};

export default React.memo(Summaries);
