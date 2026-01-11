import React from 'react';
import { useCalendar } from './hooks';

import Day from './day';
import { H2, Text, SmallText } from '@ui';
import Root, { Header, WeekdayRow, WeekdayCell, CalendarGrid, WeekRow } from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';

const CalendarEntry = ({ date }: Props) => {
	const { txsByDate, calendar, formattedTitle, monthTotal } = useCalendar(date);

	return (
		<Root>
			<Header>
				<H2 $color="#FFFFFF">{formattedTitle}</H2>

				<Text $color="#8E8E93">
					Total:&nbsp;
					<Text $color="#FFFFFF" $bold>
						{/* @TODO: Use recalc currency */}${monthTotal.toFixed(2)}
					</Text>
				</Text>
			</Header>

			<WeekdayRow>
				{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
					<WeekdayCell key={day}>
						<SmallText $color="#8E8E93" $weight={600}>
							{day}
						</SmallText>
					</WeekdayCell>
				))}
			</WeekdayRow>

			<CalendarGrid>
				{calendar.map((week) => (
					<WeekRow key={week.item_key}>
						{week.days.map((day) => {
							const dayTxs = txsByDate[day.item_key] || [];

							return <Day key={day.item_key} {...day} txs={dayTxs} />;
						})}
					</WeekRow>
				))}
			</CalendarGrid>
		</Root>
	);
};

export default CalendarEntry;
