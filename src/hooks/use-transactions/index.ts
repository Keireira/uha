import { useEffect, useMemo } from 'react';
import { startOfToday } from 'date-fns';

import { useTxDatesStore, useLensesStore } from '@screens/transactions/models';
import useSearchParams from '../use-search-params';
import { useTransactionsQuery, useTxDatesRange } from './db-queries';

const useTransactions = () => {
	const { txViewMode } = useSearchParams();
	const timeMode_raw = useLensesStore((s) => s.time_mode);
	const setMinActiveDate = useTxDatesStore((s) => s.setMinActiveDate);
	const setMaxActiveDate = useTxDatesStore((s) => s.setMaxActiveDate);

	const forcedTimeMode = txViewMode === 'calendar' ? 'all' : undefined;
	const timeMode = forcedTimeMode || timeMode_raw;
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
			setMinActiveDate(minMonthDate);
		}

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [txViewMode, minMonthDate, maxMonthDate]);

	useEffect(() => {
		setMaxActiveDate(maxMonthDate || new Date());
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [maxMonthDate]);

	return transactions;
};

export * from './types.d';
export { useTransactionsQuery, buildWhereConditions } from './db-queries';
export default useTransactions;
