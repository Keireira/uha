import React, { useMemo, useCallback } from 'react';
import {
	endOfWeek,
	endOfMonth,
	lightFormat,
	isSameDay,
	isSameMonth,
	startOfMonth,
	eachDayOfInterval,
	eachWeekOfInterval
} from 'date-fns';
import { splitEvery } from 'ramda';

import DayPreview from '../day-preview';
import Root, { MonthHeader, Week, DaysGrid } from './month-preview.styles';

import type { QuarterRowDataT } from '../../year.d';

type Props = QuarterRowDataT & {
	selectedDate: Date;
	weekStartsOn: 0 | 1;
	onPressMonth: (monthDate: Date) => void;
};

const MonthPreview = ({
	monthDate,
	daysWithTxs,
	title,
	isMonthInRange,
	selectedDate,
	weekStartsOn,
	onPressMonth
}: Props) => {
	const weeks = useMemo(() => {
		const weekStartDates = eachWeekOfInterval(
			{ start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
			{ weekStartsOn }
		);

		const allDays = weekStartDates.flatMap((weekStartDate) => {
			const weekDays = eachDayOfInterval({
				start: weekStartDate,
				end: endOfWeek(weekStartDate, { weekStartsOn })
			});

			return weekDays.map((day) => ({
				raw: day,
				item_key: `calendar-year-day-${lightFormat(day, 'yyyy-MM-dd')}`,
				content: isSameMonth(day, monthDate) ? lightFormat(day, 'd') : undefined
			}));
		});

		return splitEvery(7, allDays);
	}, [monthDate, weekStartsOn]);

	const handlePress = useCallback(() => {
		onPressMonth(monthDate);
	}, [monthDate, onPressMonth]);

	return (
		<Root $isMonthInRange={isMonthInRange} onPress={handlePress} disabled={!isMonthInRange}>
			<MonthHeader>{title}</MonthHeader>

			<DaysGrid>
				{weeks.map((week) => (
					<Week key={`week-${week[0].item_key}`}>
						{week.map((day) => (
							<DayPreview
								key={day.item_key}
								dayDate={day.raw}
								content={day.content}
								withTransactions={daysWithTxs.has(lightFormat(day.raw, 'yyyy-MM-dd'))}
								isSelected={day.content !== undefined && isSameDay(day.raw, selectedDate)}
							/>
						))}
					</Week>
				))}
			</DaysGrid>
		</Root>
	);
};

export default React.memo(MonthPreview);
