import { useMemo } from 'react';
import {
	lightFormat,
	isSameMonth,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	eachDayOfInterval,
	eachWeekOfInterval
} from 'date-fns';
import useCalendarTxs from './use-calendar-txs';

import type { CalendarEntryT } from '../calendar-entry.d';

const useCalendar = (date: Date) => {
	const { txsByDate } = useCalendarTxs(date);

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
				raw: day,
				item_key: lightFormat(day, 'dd-MM-yyyy'),
				content: isSameMonth(day, date) ? lightFormat(day, 'd') : undefined
			}));

			return formattedDays satisfies CalendarEntryT[];
		});

		const formattedMonth = month.map((week) => ({
			item_key: `week_${week[0].item_key}`,
			days: week
		}));

		return formattedMonth;
	}, [date]);

	return {
		calendar,
		txsByDate
	};
};

export default useCalendar;
