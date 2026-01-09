import { useMemo } from 'react';
import { useTransactionsQuery } from './db-queries';
import useCreatePhantomTxs from './use-create-phantom-txs';

const useTransactions = () => {
	const dbTxs = useTransactionsQuery();
	const phantomTxs = useCreatePhantomTxs();

	const sortedTxs = useMemo(() => {
		return dbTxs.concat(phantomTxs);
	}, [dbTxs, phantomTxs]);

	return sortedTxs;
};

export * from './types.d';
export default useTransactions;
