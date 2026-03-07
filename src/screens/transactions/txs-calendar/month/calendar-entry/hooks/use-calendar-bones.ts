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
import { useSettingsValue } from '@hooks';
import useCalendarTxs from './use-calendar-txs';

import type { UserT } from '@models';
import type { PreparedDbTxT } from '@hooks/use-transactions';
import type { CalendarEntryT } from '../../../txs-calendar.d';

const useCalendarBones = (monthDate: Date, transactions: PreparedDbTxT[]) => {
	const txsByDate = useCalendarTxs(monthDate, transactions);

	const firstDay = useSettingsValue<UserT['first_day']>('first_day');
	const weekStartsOn = useMemo(() => (firstDay === 'monday' ? 1 : 0), [firstDay]);

	const calendar = useMemo(() => {
		const weekStartDates = eachWeekOfInterval(
			{ start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
			{ weekStartsOn }
		);

		const month = weekStartDates.map((weekStartDate) => {
			const weekDays = eachDayOfInterval({
				start: weekStartDate,
				end: endOfWeek(weekStartDate, { weekStartsOn })
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
	}, [monthDate, weekStartsOn]);

	return {
		calendar,
		txsByDate
	};
};

export default useCalendarBones;
