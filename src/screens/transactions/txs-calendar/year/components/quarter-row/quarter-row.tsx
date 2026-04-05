import React from 'react';

import MonthPreview from '../month-preview';
import Root from './quarter-row.styles';

import type { Props } from './quarter-row.d';

const QuarterRow = ({ quarterMonths, selectedDate, weekStartsOn, onPressMonth }: Props) => (
	<Root>
		{quarterMonths.map((month) => (
			<MonthPreview
				key={month.list_key}
				{...month}
				selectedDate={selectedDate}
				weekStartsOn={weekStartsOn}
				onPressMonth={onPressMonth}
			/>
		))}
	</Root>
);

export default React.memo(QuarterRow);
