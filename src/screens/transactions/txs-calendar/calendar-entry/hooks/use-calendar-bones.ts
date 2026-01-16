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

const useCalendarBones = (monthDate: Date) => {
	const { txsByDate } = useCalendarTxs(monthDate);

	const calendar = useMemo(() => {
		const weekStartDates = eachWeekOfInterval(
			{ start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
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
				content: isSameMonth(day, monthDate) ? lightFormat(day, 'd') : undefined
			}));

			return formattedDays satisfies CalendarEntryT[];
		});

		const formattedMonth = month.map((week) => ({
			item_key: `week_${week[0].item_key}`,
			days: week
		}));

		return formattedMonth;
	}, [monthDate]);

	return {
		calendar,
		txsByDate
	};
};

export default useCalendarBones;
