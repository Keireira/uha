import React, { useRef, useMemo, useEffect } from 'react';
import { lightFormat, addMonths, subMonths } from 'date-fns';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';

import CalendarEntry from './calendar-entry';
import { Pager, Page } from './txs-calendar.styles';

import type { PagerRef } from './txs-calendar.d';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const TxsCalendar = () => {
	const pagerRef = useRef<PagerRef>(null);

	const { tx_dates } = useAppModel();
	const activeMonth = useUnit(tx_dates.activeMonth.$value);

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

		if (position === 0) {
			tx_dates.activeMonth.set(subMonths(activeMonth, 1));
			pagerRef.current?.setPageWithoutAnimation(1);
		} else if (position === 2) {
			tx_dates.activeMonth.set(addMonths(activeMonth, 1));
			pagerRef.current?.setPageWithoutAnimation(1);
		}
	};

	return (
		<Pager
			ref={pagerRef}
			pageMargin={0}
			initialPage={1}
			layoutDirection="ltr"
			orientation="horizontal"
			onPageSelected={onPageSelectedHd}
		>
			<Page key={`${lightFormat(previousMonth, 'dd-MM-yyyy')}_calendar_entry`}>
				<CalendarEntry date={previousMonth} />
			</Page>

			<Page key={`${lightFormat(currentMonth, 'dd-MM-yyyy')}_calendar_entry`}>
				<CalendarEntry date={currentMonth} />
			</Page>

			<Page key={`${lightFormat(nextMonth, 'dd-MM-yyyy')}_calendar_entry`}>
				<CalendarEntry date={nextMonth} />
			</Page>
		</Pager>
	);
};

export default TxsCalendar;
