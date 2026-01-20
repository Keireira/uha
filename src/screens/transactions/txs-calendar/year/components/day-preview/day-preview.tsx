import React from 'react';
import { isSameDay } from 'date-fns';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import Root, { DayNumber, Mark } from './day-preview.styles';

import type { Props } from './day-preview.d';

const DayPreview = ({ content, dayDate, withTransactions }: Props) => {
	const { tx_dates } = useAppModel();
	const selectedDate = useUnit(tx_dates.selected.$value);
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
