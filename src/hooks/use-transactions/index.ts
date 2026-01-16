import { useMemo } from 'react';
import { useTransactionsQuery } from './db-queries';
import useCreatePhantomTxs from './use-create-phantom-txs';

import type { TimeModesT } from '@screens/transactions/models/types.d';

const useTransactions = (forcedTimeMode?: TimeModesT) => {
	const dbTxs = useTransactionsQuery(forcedTimeMode);
	const phantomTxs = useCreatePhantomTxs();

	const sortedTxs = useMemo(() => {
		return dbTxs.concat(phantomTxs);
	}, [dbTxs, phantomTxs]);

	return sortedTxs;
};

export * from './types.d';
export default useTransactions;
