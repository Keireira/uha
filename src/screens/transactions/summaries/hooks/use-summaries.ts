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

	const { focusedDate } = useAppModel();
	const activeDate = useUnit(focusedDate.$date);

	/*
	 * for the optimized chain of rerenders
	 * activeDate -> startOfMonth -> recalcMonthKey -> transactionsMonth
	 * activeDate -> startOfMonth -> recalcYearKey -> transactionsYear
	 */
	const startOfMonth = useMemo(() => {
		const date = activeDate || new Date();

		return startOfMonthFn(date);
	}, [activeDate]);

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
