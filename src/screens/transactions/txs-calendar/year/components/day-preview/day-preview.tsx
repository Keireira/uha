import React from 'react';
import { isSameDay } from 'date-fns';

import { useTxDatesStore } from '@screens/transactions/models';

import Root, { DayNumber, Mark } from './day-preview.styles';

import type { Props } from './day-preview.d';

const DayPreview = ({ content, dayDate, withTransactions }: Props) => {
	const selectedDate = useTxDatesStore((s) => s.selectedDate);
	const isSelected = content ? isSameDay(dayDate, selectedDate) : false;

	if (!content) {
		return <Root $isEmpty />;
	}

	return (
		<Root>
			{(withTransactions || isSelected) && <Mark $isSelected={isSelected} />}

			<DayNumber $withTransactions={withTransactions} $isSelected={isSelected} adjustsFontSizeToFit numberOfLines={1}>
				{content}
			</DayNumber>
		</Root>
	);
};

export default React.memo(DayPreview);
