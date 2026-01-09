import { useMemo } from 'react';
import { getTime } from 'date-fns';
import useTransactionsQuery from './use-txs-query';
import useCreatePhantomTxs from './use-create-phantom-txs';

const useTransactions = () => {
	const dbTxs = useTransactionsQuery();
	const phantomTxs = useCreatePhantomTxs();

	const sortedTxs = useMemo(() => {
		return [...dbTxs, ...phantomTxs].sort((a, b) => getTime(a.date) - getTime(b.date));
	}, [dbTxs, phantomTxs]);

	return sortedTxs;
};

export default useTransactions;
