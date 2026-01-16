import { useMemo } from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import {
	format,
	interval,
	isWithinInterval,
	startOfMonth as startOfMonthFn,
	endOfMonth as endOfMonthFn,
	startOfYear as startOfYearFn,
	endOfYear as endOfYearFn
} from 'date-fns';
import useTransactions from '@hooks/use-transactions';

const useSummariesQuery = () => {
	const transactions = useTransactions();

	const { tx_dates, view_mode } = useAppModel();
	const focusedDate = useUnit(tx_dates.focused.$value);
	const activeMonth = useUnit(tx_dates.activeMonth.$value);
	const viewMode = useUnit(view_mode.$mode);

	/*
	 * for the optimized chain of rerenders
	 * focusedDate -> startOfMonth -> recalcMonthKey -> transactionsMonth
	 * focusedDate -> startOfMonth -> recalcYearKey -> transactionsYear
	 */
	const startOfMonth = useMemo(() => {
		if (viewMode === 'calendar') {
			return startOfMonthFn(activeMonth);
		}

		return startOfMonthFn(focusedDate);
	}, [viewMode, activeMonth, focusedDate]);

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
		year: transactionsYear,
		month: transactionsMonth,
		dates: {
			month: startOfMonth,
			year: startOfYear
		}
	};
};

export type SummariesQueryReturnT = ReturnType<typeof useSummariesQuery>;

export default useSummariesQuery;
