import React, { useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { lightFormat, addMonths, subMonths, isAfter } from 'date-fns';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';

import Weekdays from './weekdays';
import CalendarEntry from './calendar-entry';
import { Pager, Page } from './month.styles';

import type { Props, PagerRef } from './month.d';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

type PageScrollState = 'idle' | 'dragging' | 'settling';

/* Let's say I'm not proud of that shit, though it works */
const Month = ({ transactions }: Props) => {
	const pagerRef = useRef<PagerRef>(null);
	const currentPageRef = useRef(1);
	const isSettingPageRef = useRef(false);

	const { tx_dates } = useAppModel();
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const maxActiveDate = useUnit(tx_dates.maxActiveDate.$value);
	const minActiveDate = useUnit(tx_dates.minActiveDate.$value);

	const isAtMaxBoundary = isAfter(addMonths(activeMonth, 1), maxActiveDate);
	const isAtMinBoundary = !isAfter(activeMonth, minActiveDate);

	const { previousMonth, currentMonth, nextMonth } = useMemo(
		() => ({
			previousMonth: subMonths(activeMonth, 1),
			currentMonth: activeMonth,
			nextMonth: addMonths(activeMonth, 1)
		}),
		[activeMonth]
	);

	const { pages, currentIndex } = useMemo(() => {
		const result: React.ReactNode[] = [];
		let idx = 0;

		if (!isAtMinBoundary) {
			result.push(
				<Page key={`prev_${lightFormat(previousMonth, 'dd-MM-yyyy')}`}>
					<CalendarEntry monthDate={previousMonth} transactions={transactions} />
				</Page>
			);
			idx = 1;
		}

		result.push(
			<Page key={`curr_${lightFormat(currentMonth, 'dd-MM-yyyy')}`}>
				<CalendarEntry monthDate={currentMonth} transactions={transactions} />
			</Page>
		);

		if (!isAtMaxBoundary) {
			result.push(
				<Page key={`next_${lightFormat(nextMonth, 'dd-MM-yyyy')}`}>
					<CalendarEntry monthDate={nextMonth} transactions={transactions} />
				</Page>
			);
		}

		return { pages: result, currentIndex: idx };
	}, [isAtMinBoundary, isAtMaxBoundary, previousMonth, currentMonth, nextMonth, transactions]);

	useLayoutEffect(() => {
		isSettingPageRef.current = true;
		pagerRef.current?.setPageWithoutAnimation(currentIndex);
		const timeout = setTimeout(() => {
			isSettingPageRef.current = false;
			currentPageRef.current = currentIndex;
		}, 100);
		return () => clearTimeout(timeout);
	}, [activeMonth, currentIndex]);

	const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
		if (!isSettingPageRef.current) {
			currentPageRef.current = e.nativeEvent.position;
		}
	}, []);

	const onPageScrollStateChanged = useCallback(
		(e: { nativeEvent: { pageScrollState: PageScrollState } }) => {
			if (e.nativeEvent.pageScrollState !== 'idle' || isSettingPageRef.current) {
				return;
			}

			const position = currentPageRef.current;

			if (position === currentIndex) {
				return;
			}

			isSettingPageRef.current = true;

			if (position === 0 && !isAtMinBoundary) {
				tx_dates.activeMonth.set(subMonths(activeMonth, 1));
			} else if (position === pages.length - 1 && !isAtMaxBoundary) {
				tx_dates.activeMonth.set(addMonths(activeMonth, 1));
			}

			setTimeout(() => {
				isSettingPageRef.current = false;
			}, 100);
		},
		[activeMonth, isAtMinBoundary, isAtMaxBoundary, currentIndex, pages.length, tx_dates.activeMonth]
	);

	return (
		<>
			<Weekdays />

			<Pager
				ref={pagerRef}
				overScrollMode="always"
				overdrag
				initialPage={currentIndex}
				layoutDirection="ltr"
				orientation="horizontal"
				onPageSelected={onPageSelected}
				onPageScrollStateChanged={onPageScrollStateChanged}
			>
				{pages}
			</Pager>
		</>
	);
};

export default React.memo(Month);
