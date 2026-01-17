import { useMemo, useEffect } from 'react';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';
import { useTransactionsQuery } from './db-queries';
import useCreatePhantomTxs from './use-create-phantom-txs';
import { format } from 'date-fns';

const useTransactions = (debugLabel: string) => {
	const { view_mode, tx_dates } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);

	const { dbTxs, minDbTxsDate } = useTransactionsQuery(viewMode === 'calendar' ? 'all' : undefined);
	const { phantomTxs, minPhantomTxsDate, maxDate } = useCreatePhantomTxs(debugLabel);

	const sortedTxs = useMemo(() => {
		return dbTxs.concat(phantomTxs);
	}, [dbTxs, phantomTxs]);

	useEffect(() => {
		/* We need that date for calendar view only for now */
		if (viewMode === 'calendar' && minDbTxsDate) {
			tx_dates.minActiveDate.set(minDbTxsDate);
		}

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [viewMode, minDbTxsDate, minPhantomTxsDate]);

	useEffect(() => {
		// console.log('[SET MAX DATE]:', format(maxDate, 'dd-MM-yyyy'));
		tx_dates.maxActiveDate.set(maxDate);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [maxDate]);

	return sortedTxs;
};

export * from './types.d';
export default useTransactions;
