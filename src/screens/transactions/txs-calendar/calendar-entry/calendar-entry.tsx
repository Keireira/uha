import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { lightFormat, isSameDay } from 'date-fns';

import { useAppModel } from '@models';
import { useCalendarBones } from './hooks';
import { useScrollDirection } from '@hooks';

import Day from './day';
import Weekdays from './weekdays';
import TxsAtDay from './txs-at-day';
import { ScrollView } from 'react-native';
import Root, { CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';
import type { PreparedDbTxT } from '@hooks/use-transactions';

const EMPTY_TXS: PreparedDbTxT[] = [];

const CalendarEntry = ({ monthDate }: Props) => {
	const handleScroll = useScrollDirection();
	const { tx_dates } = useAppModel();
	const selectedDate = useUnit(tx_dates.selected.$value);

	const { txsByDate, calendar } = useCalendarBones(monthDate);

	const selectedDateTxs = useMemo(() => {
		return txsByDate[lightFormat(selectedDate, 'dd-MM-yyyy')];
	}, [selectedDate, txsByDate]);

	return (
		<Root>
			<Weekdays />

			<ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} onScroll={handleScroll}>
				<CalendarGrid>
					{calendar.map((week) => (
						<WeekRow key={week.item_key}>
							{week.days.map((day) => (
								<Day
									key={day.item_key}
									{...day}
									isSelected={isSameDay(day.raw, selectedDate)}
									txs={txsByDate[day.item_key] || EMPTY_TXS}
									setSelectedDay={tx_dates.selected.set}
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
