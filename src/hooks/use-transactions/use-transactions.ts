import useTransactionsQuery from './use-txs-query';
import useCreatePhantomTxs from './use-create-phantom-txs';

const useTransactions = () => {
	const dbTxs = useTransactionsQuery();
	const phantomTxs = useCreatePhantomTxs();

	return [...dbTxs, ...phantomTxs];
};

export default useTransactions;
