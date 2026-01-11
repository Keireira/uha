import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightFormat, addMonths, startOfMonth, subMonths } from 'date-fns';

import CalendarEntry from './calendar-entry';
import Root, { Pager, Page } from './txs-calendar.styles';

import type { PagerRef } from './txs-calendar.d';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const TxsCalendar = () => {
	const insets = useSafeAreaInsets();
	const pagerRef = useRef<PagerRef>(null);
	const [activeMonth, setActiveMonth] = useState(startOfMonth(new Date()));

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
			setActiveMonth((prev) => subMonths(prev, 1));
			pagerRef.current?.setPageWithoutAnimation(1);
		} else if (position === 2) {
			setActiveMonth((prev) => addMonths(prev, 1));
			pagerRef.current?.setPageWithoutAnimation(1);
		}
	};

	return (
		<Root $top={insets.top} $bottom={insets.bottom}>
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
		</Root>
	);
};

export default TxsCalendar;
