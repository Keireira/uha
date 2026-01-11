import { useMemo } from 'react';
import {
	format,
	lightFormat,
	isSameYear,
	isSameMonth,
	startOfToday,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	eachDayOfInterval,
	eachWeekOfInterval
} from 'date-fns';

const useBuildCalendar = (date: Date) => {
	const calendar = useMemo(() => {
		const weekStartDates = eachWeekOfInterval(
			{ start: startOfMonth(date), end: endOfMonth(date) },
			{ weekStartsOn: 1 }
		);

		const month = weekStartDates.map((weekStartDate) => {
			const weekDays = eachDayOfInterval({
				start: weekStartDate,
				end: endOfWeek(weekStartDate, { weekStartsOn: 1 })
			});

			const formattedDays = weekDays.map((day) => ({
				key: day.toISOString(),
				content: isSameMonth(day, date) ? lightFormat(day, 'd') : undefined,
				raw: day
			}));

			return formattedDays;
		});

		const formattedMonth = month.map((week) => ({
			key: `week_${week[0].key}`,
			content: week
		}));

		return formattedMonth;
	}, [date]);

	const formattedTitle = useMemo(() => {
		const isCurrentYear = isSameYear(date, startOfToday());

		return isCurrentYear ? format(date, 'MMMM') : format(date, 'MMMM, yyyy');
	}, [date]);

	return {
		formattedTitle,
		calendar
	};
};

export default useBuildCalendar;
