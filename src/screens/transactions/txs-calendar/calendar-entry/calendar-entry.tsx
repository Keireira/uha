import React, { useState, useMemo } from 'react';
import { useCalendar } from './hooks';
import { lightFormat, isSameDay } from 'date-fns';

import Day from './day';
import Header from './header';
import Weekdays from './weekdays';
import TxsAtDay from './txs-at-day';
import { ScrollView } from 'react-native';
import Root, { CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_TXS: PreparedDbTxT[] = [];

const CalendarEntry = ({ date }: Props) => {
	const [selectedDay, setSelectedDay] = useState(date);
	const { txsByDate, calendar, formattedTitle, monthTotal } = useCalendar(date);

	const selectedDateTxs = useMemo(() => {
		return txsByDate[lightFormat(selectedDay, 'dd-MM-yyyy')];
	}, [selectedDay, txsByDate]);

	return (
		<Root>
			<Header title={formattedTitle} total={monthTotal} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<Weekdays />

				<CalendarGrid>
					{calendar.map((week) => (
						<WeekRow key={week.item_key}>
							{week.days.map((day) => (
								<Day
									key={day.item_key}
									{...day}
									isSelected={isSameDay(day.raw, selectedDay)}
									txs={txsByDate[day.item_key] || EMPTY_TXS}
									setSelectedDay={setSelectedDay}
								/>
							))}
						</WeekRow>
					))}
				</CalendarGrid>

				<TxsAtDay txs={selectedDateTxs} />
			</ScrollView>
		</Root>
	);
};

export default React.memo(CalendarEntry);
