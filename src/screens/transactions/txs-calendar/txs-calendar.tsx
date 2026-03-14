import React from 'react';

import { useSearchParams } from '@hooks';

import Year from './year';
import Month from './month';
import Root from './txs-calendar.styles';

import type { Props } from './txs-calendar.d';

const TxsCalendar = ({ transactions }: Props) => {
	const { calendarScale } = useSearchParams();

	return (
		<Root>
			{calendarScale === 'month' && <Month transactions={transactions} />}
			{calendarScale === 'year' && <Year transactions={transactions} />}
		</Root>
	);
};

export default TxsCalendar;
