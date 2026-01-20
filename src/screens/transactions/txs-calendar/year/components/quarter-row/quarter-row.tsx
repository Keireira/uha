import React from 'react';

import MonthPreview from '../month-preview';
import Root from './quarter-row.styles';

import type { Props } from './quarter-row.d';

const QuarterRow = ({ quarterMonths }: Props) => (
	<Root>
		{quarterMonths.map((month) => (
			<MonthPreview key={month.list_key} {...month} />
		))}
	</Root>
);

export default React.memo(QuarterRow);
