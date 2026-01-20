import React, { useMemo, useCallback } from 'react';
import {
	endOfWeek,
	endOfMonth,
	lightFormat,
	isSameMonth,
	startOfMonth,
	eachDayOfInterval,
	eachWeekOfInterval
} from 'date-fns';
import { splitEvery } from 'ramda';

import { useAppModel } from '@models';

import DayPreview from '../day-preview';
import Root, { MonthHeader, Week, DaysGrid } from './month-preview.styles';

import type { QuarterRowDataT } from '../../year.d';

const MonthPreview = ({ monthDate, daysWithTxs, title, isMonthInRange }: QuarterRowDataT) => {
	const { tx_dates, view_mode } = useAppModel();

	const weeks = useMemo(() => {
		const weekStartDates = eachWeekOfInterval(
			{ start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
			{ weekStartsOn: 1 }
		);

		const allDays = weekStartDates.flatMap((weekStartDate) => {
			const weekDays = eachDayOfInterval({
				start: weekStartDate,
				end: endOfWeek(weekStartDate, { weekStartsOn: 1 })
			});

			return weekDays.map((day) => ({
				raw: day,
				item_key: `calendar-year-day-${lightFormat(day, 'yyyy-MM-dd')}`,
				content: isSameMonth(day, monthDate) ? lightFormat(day, 'd') : undefined
			}));
		});

		return splitEvery(7, allDays);
	}, [monthDate]);

	const onPressMonth = useCallback(() => {
		tx_dates.activeMonth.set(monthDate);
		view_mode.calendar.setScale('month');
	}, [monthDate, tx_dates, view_mode]);

	return (
		<Root $isMonthInRange={isMonthInRange} onPress={onPressMonth} disabled={!isMonthInRange}>
			<MonthHeader>{title}</MonthHeader>

			<DaysGrid>
				{weeks.map((week) => {
					const days = week.map((day) => {
						const withTransactions = daysWithTxs.has(lightFormat(day.raw, 'yyyy-MM-dd'));

						return (
							<DayPreview
								key={day.item_key}
								dayDate={day.raw}
								content={day.content}
								withTransactions={withTransactions}
							/>
						);
					});

					return <Week key={`week-${week[0].item_key}`}>{days}</Week>;
				})}
			</DaysGrid>
		</Root>
	);
};

export default React.memo(MonthPreview);
