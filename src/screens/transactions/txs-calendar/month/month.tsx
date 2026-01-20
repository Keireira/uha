import React, { useRef, useMemo, useEffect } from 'react';
import { lightFormat, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';

import Weekdays from './weekdays';
import EmptyEntry from './empty-entry';
import CalendarEntry from './calendar-entry';
import { Pager, Page } from './month.styles';

import type { Props, PagerRef } from './month.d';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const Month = ({ transactions }: Props) => {
	const pagerRef = useRef<PagerRef>(null);

	const { tx_dates } = useAppModel();
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const maxActiveDate = useUnit(tx_dates.maxActiveDate.$value);
	const minActiveDate = useUnit(tx_dates.minActiveDate.$value);

	const isAtMaxBoundary = isAfter(addMonths(activeMonth, 1), maxActiveDate);
	const isAtMinBoundary = isBefore(activeMonth, minActiveDate);

	/*
	 * Unfortunately, if you swipe too fast, the pager will not be able to update the active month at time,
	 * and will be stuck forever. So we forcefully update the active month after a small delay, just in case
	 * Probably, I should to come to another solution but i don't care for now
	 * (maybe write yet another library as react-native-gesture-handler wrapper??)
	 */
	useEffect(() => {
		const interval = setTimeout(() => {
			pagerRef.current?.setPageWithoutAnimation(1);
		}, 125);

		return () => clearTimeout(interval);
	}, [activeMonth]);

	const { previousMonth, currentMonth, nextMonth } = useMemo(
		() => ({
			previousMonth: subMonths(activeMonth, 1),
			currentMonth: activeMonth,
			nextMonth: addMonths(activeMonth, 1)
		}),
		[activeMonth]
	);

	const onPageSelectedHd = (e: PagerViewOnPageSelectedEvent) => {
		const position = e.nativeEvent.position;
		console.log('PAGE SELECTED:', position);
		// console.log(e.target);

		// Block forward swipe at max boundary
		if (isAtMaxBoundary && position === 2) {
			pagerRef.current?.setPageWithoutAnimation(1);
			return;
		}

		// Block backward swipe at min boundary
		if (isAtMinBoundary && position === 0) {
			pagerRef.current?.setPageWithoutAnimation(1);
			return;
		}

		let nextMonth: Date | undefined;

		if (position === 0) {
			nextMonth = subMonths(activeMonth, 1);
		} else if (position === 2) {
			nextMonth = addMonths(activeMonth, 1);
		}

		if (!nextMonth) return;

		if (position === 0) {
			tx_dates.activeMonth.set(nextMonth);
			pagerRef.current?.setPageWithoutAnimation(1);
		}

		if (position === 2 && !isAfter(currentMonth, subMonths(maxActiveDate, 1))) {
			tx_dates.activeMonth.set(nextMonth);
			pagerRef.current?.setPageWithoutAnimation(1);
		}
	};

	return (
		<>
			<Weekdays />

			<Pager
				ref={pagerRef}
				pageMargin={0}
				initialPage={1}
				layoutDirection="ltr"
				orientation="horizontal"
				onPageSelected={onPageSelectedHd}
			>
				<Page key={`${lightFormat(previousMonth, 'dd-MM-yyyy')}_calendar_entry`}>
					{isBefore(subMonths(activeMonth, 1), minActiveDate) ? (
						<EmptyEntry />
					) : (
						<CalendarEntry monthDate={previousMonth} transactions={transactions} />
					)}
				</Page>

				<Page key={`${lightFormat(currentMonth, 'dd-MM-yyyy')}_calendar_entry`}>
					<CalendarEntry monthDate={currentMonth} transactions={transactions} />
				</Page>

				<Page key={`${lightFormat(nextMonth, 'dd-MM-yyyy')}_calendar_entry`}>
					{isAfter(currentMonth, subMonths(maxActiveDate, 1)) ? (
						<EmptyEntry />
					) : (
						<CalendarEntry monthDate={nextMonth} transactions={transactions} />
					)}
				</Page>
			</Pager>
		</>
	);
};

export default Month;
