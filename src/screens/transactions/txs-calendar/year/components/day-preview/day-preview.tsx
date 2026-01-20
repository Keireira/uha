import React from 'react';

import Root, { DayNumber, Mark } from './day-preview.styles';

import type { Props } from './day-preview.d';

const DayPreview = ({ content, isSelected, withTransactions }: Props) => {
	if (!content) {
		return <Root $isSelected={false} $isEmpty />;
	}

	return (
		<Root $isSelected={isSelected}>
			<DayNumber $isSelected={isSelected}>{content}</DayNumber>

			{withTransactions && <Mark />}
		</Root>
	);
};

export default React.memo(DayPreview);
