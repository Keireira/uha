import { useEffect } from 'react';

import { useAppModel } from '@models';
import useSearchParams from '../use-search-params';
import { useTransactionsQuery } from './db-queries';

const useTransactions = (debugLabel: string) => {
	const { tx_dates } = useAppModel();
	const { txViewMode } = useSearchParams();

	const { dbTxs, minMonthDate, maxMonthDate } = useTransactionsQuery(txViewMode === 'calendar' ? 'all' : undefined);

	useEffect(() => {
		/* We need that date for calendar view only for now */
		if (txViewMode === 'calendar' && minMonthDate) {
			tx_dates.minActiveDate.set(minMonthDate);
		}

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [txViewMode, minMonthDate, maxMonthDate]);

	useEffect(() => {
		tx_dates.maxActiveDate.set(maxMonthDate || new Date());
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [maxMonthDate]);

	return {
		transactions: dbTxs
	};
};

export * from './types.d';
export default useTransactions;
