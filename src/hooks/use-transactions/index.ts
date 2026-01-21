import { useMemo, useEffect } from 'react';

import { useAppModel } from '@models';
import useSearchParams from '../use-search-params';
import { useTransactionsQuery } from './db-queries';
import useCreatePhantomTxs from './use-create-phantom-txs';

const useTransactions = (debugLabel: string) => {
	const { tx_dates } = useAppModel();
	const { txViewMode } = useSearchParams();

	const { dbTxs, minDbTxsDate } = useTransactionsQuery(txViewMode === 'calendar' ? 'all' : undefined);
	const { phantomTxs, minPhantomTxsDate, maxDate } = useCreatePhantomTxs(debugLabel);

	const sortedTxs = useMemo(() => {
		return dbTxs.concat(phantomTxs);
	}, [dbTxs, phantomTxs]);

	useEffect(() => {
		/* We need that date for calendar view only for now */
		if (txViewMode === 'calendar' && minDbTxsDate) {
			tx_dates.minActiveDate.set(minDbTxsDate);
		}

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [txViewMode, minDbTxsDate, minPhantomTxsDate]);

	useEffect(() => {
		// console.log('[SET MAX DATE]:', format(maxDate, 'dd-MM-yyyy'));
		tx_dates.maxActiveDate.set(maxDate);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [maxDate]);

	return {
		transactions: sortedTxs
	};
};

export * from './types.d';
export default useTransactions;
