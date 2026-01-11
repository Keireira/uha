import { useMemo } from 'react';
import useTransactions from '@hooks/use-transactions';
import { lightFormat, interval, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const useCalendarTxs = (activeDate: Date) => {
	const allTransactions = useTransactions('all');

	const { start, end } = useMemo(
		() => ({
			start: startOfMonth(activeDate),
			end: endOfMonth(activeDate)
		}),
		[activeDate]
	);

	const transactions = useMemo(() => {
		const filteredTxs = allTransactions.filter((tx) => isWithinInterval(new Date(tx.date), interval(start, end)));

		const txsByDate = filteredTxs.reduce(
			(acc, tx) => {
				const key = lightFormat(tx.date, 'dd-MM-yyyy');

				acc[key] ??= [];
				acc[key].push(tx);

				return acc;
			},
			{} as Record<string, PreparedDbTxT[]>
		);

		const total = filteredTxs.reduce((acc, tx) => acc + tx.price / (tx.denominator || 1), 0);

		return {
			txs: filteredTxs,
			txsByDate,
			total
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [start, end, allTransactions.length]);

	return transactions;
};

export default useCalendarTxs;
