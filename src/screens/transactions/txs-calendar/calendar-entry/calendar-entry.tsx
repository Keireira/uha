import React from 'react';
import { useCalendar } from './hooks';

import Day from './day';
import Header from './header';
import Weekdays from './weekdays';
import Root, { CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_TXS: PreparedDbTxT[] = [];

const CalendarEntry = ({ date }: Props) => {
	const { txsByDate, calendar, formattedTitle, monthTotal } = useCalendar(date);

	return (
		<Root>
			<Header title={formattedTitle} total={monthTotal} />

			<Weekdays />

			<CalendarGrid>
				{calendar.map((week) => (
					<WeekRow key={week.item_key}>
						{week.days.map((day) => (
							<Day key={day.item_key} {...day} txs={txsByDate[day.item_key] || EMPTY_TXS} />
						))}
					</WeekRow>
				))}
			</CalendarGrid>
		</Root>
	);
};

export default React.memo(CalendarEntry);
