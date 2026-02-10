import { useEffect, useMemo } from 'react';

import { useAppModel } from '@models';
import useSearchParams from '../use-search-params';
import { useTransactionsQuery, useTxDatesRange } from './db-queries';

const useTransactions = (debugLabel: string) => {
	const { txViewMode } = useSearchParams();
	const { tx_dates } = useAppModel();

	const forcedTimeMode = useMemo(() => (txViewMode === 'calendar' ? 'all' : undefined), [txViewMode]);

	const [minMonthDate, maxMonthDate] = useTxDatesRange(forcedTimeMode);
	const transactions = useTransactionsQuery({
		withFilters: true,
		forcedTimeMode
	});

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

	return transactions;
};

export * from './types.d';
export { useTransactionsQuery, buildWhereConditions } from './db-queries';
export default useTransactions;
