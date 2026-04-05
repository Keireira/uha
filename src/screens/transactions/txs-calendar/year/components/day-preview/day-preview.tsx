import React from 'react';

import Root, { DayNumber, Mark } from './day-preview.styles';

import type { Props } from './day-preview.d';

const DayPreview = ({ content, withTransactions, isSelected }: Props) => {
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
