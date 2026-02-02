import { useMemo } from 'react';
import { useUnit } from 'effector-react';
import {
	format,
	interval,
	isSameDay,
	isWithinInterval,
	lightFormat,
	startOfMonth as startOfMonthFn,
	endOfMonth as endOfMonthFn,
	startOfYear as startOfYearFn,
	endOfYear as endOfYearFn
} from 'date-fns';

import { useAppModel } from '@models';
import { useSearchParams, useTransactions } from '@hooks';

import type { PreparedDbTxT } from '@hooks/use-transactions';

type ReturnT = {
	day: PreparedDbTxT[];
	year: PreparedDbTxT[];
	month: PreparedDbTxT[];
	dates: {
		dayRaw: Date;
		dayFormatted: string;
		monthStartRaw: Date;
		monthStartFormatted: string;
		monthEndRaw: Date;
		monthEndFormatted: string;
		yearStartRaw: Date;
		yearStartFormatted: string;
		yearEndRaw: Date;
		yearEndFormatted: string;
	};
};

const useSummariesQuery = (): ReturnT => {
	const { txViewMode } = useSearchParams();
	const { transactions } = useTransactions('useSummariesQuery');

	const { tx_dates } = useAppModel();
	const focusedDate = useUnit(tx_dates.focused.$value);
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const selectedDate = useUnit(tx_dates.selected.$value);

	/*
	 * for the optimized chain of rerenders
	 * focusedDate -> startOfMonth -> recalcMonthKey -> transactionsMonth
	 * focusedDate -> startOfMonth -> recalcYearKey -> transactionsYear
	 */
	const startOfMonth = useMemo(() => {
		if (txViewMode === 'calendar') {
			return startOfMonthFn(activeMonth);
		}

		return startOfMonthFn(focusedDate);
	}, [txViewMode, activeMonth, focusedDate]);

	const { recalcYearKey, recalcMonthKey, endOfMonth, startOfYear, endOfYear } = useMemo(
		() => ({
			recalcYearKey: `year_${format(startOfMonth, 'yyyy')}`,
			recalcMonthKey: `month_${format(startOfMonth, 'yyyy-MM')}`,
			endOfMonth: endOfMonthFn(startOfMonth),
			startOfYear: startOfYearFn(startOfMonth),
			endOfYear: endOfYearFn(startOfMonth)
		}),
		[startOfMonth]
	);

	const transactionsDay = useMemo(() => {
		return transactions.filter((tx) => isSameDay(new Date(tx.date), selectedDate));
	}, [selectedDate, transactions]);

	const transactionsMonth = useMemo(() => {
		const filteredTxs = transactions.filter((tx) =>
			isWithinInterval(new Date(tx.date), interval(startOfMonth, endOfMonth))
		);

		return filteredTxs;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [recalcMonthKey, transactions.length]);

	const transactionsYear = useMemo(() => {
		const filteredTxs = transactions.filter((tx) =>
			isWithinInterval(new Date(tx.date), interval(startOfYear, endOfYear))
		);

		return filteredTxs;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [recalcYearKey, transactions.length]);

	return {
		day: transactionsDay,
		year: transactionsYear,
		month: transactionsMonth,
		dates: {
			dayRaw: selectedDate,
			dayFormatted: lightFormat(selectedDate, 'yyyy-MM-dd'),
			monthStartRaw: startOfMonth,
			monthStartFormatted: lightFormat(startOfMonth, 'yyyy-MM-dd'),
			monthEndRaw: endOfMonth,
			monthEndFormatted: lightFormat(endOfMonth, 'yyyy-MM-dd'),
			yearStartRaw: startOfYear,
			yearStartFormatted: lightFormat(startOfYear, 'yyyy-MM-dd'),
			yearEndRaw: endOfYear,
			yearEndFormatted: lightFormat(endOfYear, 'yyyy-MM-dd')
		}
	} satisfies ReturnT;
};

export default useSummariesQuery;
