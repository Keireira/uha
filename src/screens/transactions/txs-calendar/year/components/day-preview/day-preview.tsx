import React from 'react';

import Root, { DayNumber, Mark } from './day-preview.styles';

import type { Props } from './day-preview.d';

const DayPreview = ({ content, isSelected, isMonthInRange, withTransactions }: Props) => {
	if (!content) {
		return <Root $isSelected={false} $isInRange={isMonthInRange} $isEmpty />;
	}

	return (
		<Root $isSelected={isSelected} $isInRange={isMonthInRange}>
			<DayNumber $isSelected={isSelected} $isInRange={isMonthInRange}>
				{content}
			</DayNumber>

			{withTransactions && <Mark />}
		</Root>
	);
};

export default React.memo(DayPreview);
