import React, { useMemo } from 'react';
import { lightFormat, isSameDay, isSameMonth } from 'date-fns';

import { roundToEven } from '@lib';
import { useTxDatesStore } from '@screens/transactions/models';
import { useCalendarBones } from './hooks';

import Day from './day';
import TxsAtDay from './txs-at-day';
import { ScrollView, useWindowDimensions } from 'react-native';
import Root, { CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_TXS: PreparedDbTxT[] = [];

const CalendarEntry = ({ monthDate, transactions }: Props) => {
	const { width } = useWindowDimensions();

	const selectedDate = useTxDatesStore((s) => s.selectedDate);
	const activeMonth = useTxDatesStore((s) => s.activeMonth);
	const setSelectedDate = useTxDatesStore((s) => s.setSelectedDate);
	const { txsByDate, calendar } = useCalendarBones(monthDate, transactions);

	const selectedDateTxs = useMemo(() => {
		return txsByDate[lightFormat(selectedDate, 'dd-MM-yyyy')];
	}, [selectedDate, txsByDate]);

	const iconSize = useMemo(() => {
		return roundToEven((width / 7) * 0.6);
	}, [width]);

	return (
		<Root>
			<ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
				<CalendarGrid>
					{calendar.map((week) => (
						<WeekRow key={week.item_key}>
							{week.days.map((day) => (
								<Day
									key={day.item_key}
									{...day}
									iconSize={iconSize}
									isSelected={isSameDay(day.raw, selectedDate)}
									txs={txsByDate[day.item_key] || EMPTY_TXS}
									setSelectedDay={setSelectedDate}
								/>
							))}
						</WeekRow>
					))}
				</CalendarGrid>

				{isSameMonth(selectedDate, activeMonth) && <TxsAtDay txs={selectedDateTxs} />}
			</ScrollView>
		</Root>
	);
};

export default React.memo(CalendarEntry);
