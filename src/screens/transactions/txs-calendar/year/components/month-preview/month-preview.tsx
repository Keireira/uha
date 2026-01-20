import React from 'react';
import {
	lightFormat,
	isSameDay as isSameDayFn,
	endOfMonth,
	startOfMonth,
	endOfWeek,
	isSameMonth,
	eachDayOfInterval,
	eachWeekOfInterval
} from 'date-fns';
import DayPreview from '../day-preview';
import { MonthCard, MonthHeader, DaysGrid } from './month-preview.styles';

import { useAppModel } from '@models';
import { useUnit } from 'effector-react';

import type { CalendarEntryT } from '../../../txs-calendar.d';
import type { QuarterRowDataT } from '../../year.d';

type Props = QuarterRowDataT;

const MonthPreview = ({ monthDate, daysWithTransactions, title, isMonthInRange }: Props) => {
	const { tx_dates, view_mode } = useAppModel();
	const selectedDate = useUnit(tx_dates.selected.$value);

	const weekStartDates = eachWeekOfInterval(
		{ start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
		{ weekStartsOn: 1 }
	);

	const weeks = weekStartDates.map((weekStartDate) => {
		const weekDays = eachDayOfInterval({
			start: weekStartDate,
			end: endOfWeek(weekStartDate, { weekStartsOn: 1 })
		});

		const formattedDays = weekDays.map((day) => ({
			raw: day,
			item_key: `calendar-year-day-${lightFormat(day, 'dd-MM-yyyy')}`,
			content: isSameMonth(day, monthDate) ? lightFormat(day, 'd') : undefined
		}));

		return formattedDays satisfies CalendarEntryT[];
	});

	const days = weeks.flatMap((week) => week);

	const onPressMonth = () => {
		tx_dates.activeMonth.set(monthDate);
		view_mode.calendar.setScale('month');
	};

	return (
		<MonthCard onPress={onPressMonth} disabled={!isMonthInRange}>
			<MonthHeader $isInRange={isMonthInRange}>{title}</MonthHeader>

			<DaysGrid>
				{days.map((day) => {
					const isSelected = isSameDayFn(day.raw, selectedDate);
					const withTransactions = daysWithTransactions.includes(day.raw);

					return (
						<DayPreview
							key={day.item_key}
							content={day.content}
							isSelected={isSelected}
							isMonthInRange={isMonthInRange}
							withTransactions={withTransactions}
						/>
					);
				})}
			</DaysGrid>
		</MonthCard>
	);
};

export default React.memo(MonthPreview);
