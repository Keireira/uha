import { useEffect, useMemo } from 'react';
import { useUnit } from 'effector-react';
import { startOfToday } from 'date-fns';

import { useAppModel } from '@models';
import useSearchParams from '../use-search-params';
import { useTransactionsQuery, useTxDatesRange } from './db-queries';

const useTransactions = (debugLabel: string) => {
	const { txViewMode } = useSearchParams();
	const { tx_dates, lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const forcedTimeMode = txViewMode === 'calendar' ? 'all' : undefined;
	const timeMode = forcedTimeMode || lensesStore.time_mode;
	const [minMonthDate, maxMonthDate] = useTxDatesRange(forcedTimeMode);
	const dbTransactions = useTransactionsQuery({
		withFilters: true,
		forcedTimeMode
	});

	/** Guard against stale useLiveQuery results during view mode transitions */
	const transactions = useMemo(() => {
		if (timeMode !== 'future') return dbTransactions;

		const today = startOfToday();
		return dbTransactions.filter((tx) => new Date(tx.date) >= today);
	}, [dbTransactions, timeMode]);

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
