import React, { useMemo } from 'react';
import { useSettingsValue } from '@hooks';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

import Root, { WeekdayCell, WeekdayText } from './weekdays.styles';

import type { UserT } from '@models';

const Weekdays = () => {
	const firstDay = useSettingsValue<UserT['first_day']>('first_day');
	const weekStartsOn = useMemo(() => (firstDay === 'monday' ? 1 : 0), [firstDay]);

	const weekdays = useMemo(() => {
		const now = new Date();
		const start = startOfWeek(now, { weekStartsOn });
		const end = endOfWeek(now, { weekStartsOn });

		const days = eachDayOfInterval({ start, end });

		return days.map((day) => format(day, 'EEE'));
	}, [weekStartsOn]);

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
