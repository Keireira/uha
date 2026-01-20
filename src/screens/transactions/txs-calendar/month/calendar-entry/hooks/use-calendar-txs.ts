import { useMemo } from 'react';
import { lightFormat, interval, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const useCalendarTxs = (activeDate: Date, transactions: PreparedDbTxT[]) => {
	const { start, end } = useMemo(
		() => ({
			start: startOfMonth(activeDate),
			end: endOfMonth(activeDate)
		}),
		[activeDate]
	);

	const selectedTransactions = useMemo(() => {
		const filteredTxs = transactions.filter((tx) => isWithinInterval(new Date(tx.date), interval(start, end)));

		const txsByDate = filteredTxs.reduce(
			(acc, tx) => {
				const key = lightFormat(tx.date, 'dd-MM-yyyy');

				acc[key] ??= [];
				acc[key].push(tx);

				return acc;
			},
			{} as Record<string, PreparedDbTxT[]>
		);

		return txsByDate;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [start, end, transactions.length]);

	return selectedTransactions;
};

export default useCalendarTxs;
