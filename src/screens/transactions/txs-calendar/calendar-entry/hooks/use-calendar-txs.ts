import { useMemo } from 'react';
import useTransactions from '@hooks/use-transactions';
import { interval, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const useCalendarTxs = (activeDate: Date) => {
	const allTransactions = useTransactions();

	const { start, end } = useMemo(() => {
		const date = activeDate || new Date();

		return {
			start: startOfMonth(date),
			end: endOfMonth(date)
		};
	}, [activeDate]);

	const transactions = useMemo(() => {
		const filteredTxs = allTransactions.filter((tx) => isWithinInterval(new Date(tx.date), interval(start, end)));
		const total = filteredTxs.reduce((acc, tx) => acc + tx.price / (tx.denominator || 1), 0);

		return {
			filteredTxs,
			total
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [start, end, allTransactions.length]);

	return {
		txs: transactions.filteredTxs,
		total: transactions.total
	};
};

export default useCalendarTxs;
