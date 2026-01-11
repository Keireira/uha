import React from 'react';
import { useCalendarTxs, useBuildCalendar } from './hooks';

import { H2, LargeText } from '@ui';
import { View, Text } from 'react-native';
import Root from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';

const CalendarEntry = ({ date }: Props) => {
	const { txs, total } = useCalendarTxs(date);
	const { calendar, formattedTitle } = useBuildCalendar(date);

	return (
		<Root>
			<H2>{formattedTitle}</H2>
			<Text>{txs.length}</Text>
			<Text>Monthly total: {total}</Text>

			<View>
				{calendar.map((week) => (
					<View key={week.key} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						{week.content.map((day) => {
							return <LargeText key={day.key}>{day.content ?? ''}</LargeText>;
						})}
					</View>
				))}
			</View>
		</Root>
	);
};

export default CalendarEntry;
