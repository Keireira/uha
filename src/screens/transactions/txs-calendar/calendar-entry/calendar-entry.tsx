import React, { useState, useMemo } from 'react';
import { lightFormat, isSameDay, startOfToday, isAfter } from 'date-fns';

import { useCalendar } from './hooks';
import { useScrollDirection } from '@hooks';

import Day from './day';
import Header from './header';
import Weekdays from './weekdays';
import TxsAtDay from './txs-at-day';
import { ScrollView } from 'react-native';
import Root, { CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_TXS: PreparedDbTxT[] = [];

// @TODO: Improve date selection logic
const CalendarEntry = ({ date }: Props) => {
	const handleScroll = useScrollDirection();

	const today = startOfToday();
	const [selectedDay, setSelectedDay] = useState(isAfter(today, date) ? today : date);

	const { txsByDate, calendar, monthTotal } = useCalendar(date);

	const selectedDateTxs = useMemo(() => {
		return txsByDate[lightFormat(selectedDay, 'dd-MM-yyyy')];
	}, [selectedDay, txsByDate]);

	return (
		<Root>
			<Header total={monthTotal} />

			<Weekdays />

			<ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} onScroll={handleScroll}>
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
