import React from 'react';
import { format } from 'date-fns';

import { Text } from 'react-native';
import Root from './calendar-entry.styles';

import type { Props } from './calendar-entry.d';

const CalendarEntry = ({ date }: Props) => {
	return (
		<Root>
			<Text>{format(date, 'dd MMMM yyyy')}</Text>
		</Root>
	);
};

export default CalendarEntry;
