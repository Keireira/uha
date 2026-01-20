import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

import { useAppModel } from '@models';

import Root, { WeekdayCell, WeekdayText } from './weekdays.styles';

const Weekdays = () => {
	const { tx_dates } = useAppModel();
	const isTerminationView = useUnit(tx_dates.is_termination_view.$value);

	const weekdays = useMemo(() => {
		const now = new Date();
		const start = startOfWeek(now);
		const end = endOfWeek(now);

		const days = eachDayOfInterval({ start, end });

		return days.map((day) => format(day, 'EEE'));
	}, []);

	return (
		<Root $isDisabled={isTerminationView}>
			{weekdays.map((day) => (
				<WeekdayCell key={day}>
					<WeekdayText>{day}</WeekdayText>
				</WeekdayCell>
			))}
		</Root>
	);
};

export default React.memo(Weekdays);
