import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

import Root, { WeekdayCell, WeekdayText } from './weekdays.styles';

const Weekdays = () => {
	const weekdays = useMemo(() => {
		const now = new Date();
		const start = startOfWeek(now);
		const end = endOfWeek(now);

		const days = eachDayOfInterval({ start, end });

		return days.map((day) => format(day, 'EEE'));
	}, []);

	return (
		<Root>
			{weekdays.map((day) => (
				<WeekdayCell key={day}>
					<WeekdayText>{day}</WeekdayText>
				</WeekdayCell>
			))}
		</Root>
	);
};

export default React.memo(Weekdays);
