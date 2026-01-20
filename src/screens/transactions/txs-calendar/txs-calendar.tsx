import React from 'react';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import Year from './year';
import Month from './month';
import Root from './txs-calendar.styles';

import type { Props } from './txs-calendar.d';

const TxsCalendar = ({ transactions }: Props) => {
	const { view_mode } = useAppModel();
	const calendarScale = useUnit(view_mode.calendar.$scale);

	return (
		<Root>
			{calendarScale === 'month' && <Month transactions={transactions} />}
			{calendarScale === 'year' && <Year transactions={transactions} />}
		</Root>
	);
};

export default TxsCalendar;
