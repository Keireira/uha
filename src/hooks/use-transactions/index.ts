import { useMemo } from 'react';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';
import { useTransactionsQuery } from './db-queries';
import useCreatePhantomTxs from './use-create-phantom-txs';

const useTransactions = () => {
	const { view_mode } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);

	const dbTxs = useTransactionsQuery(viewMode === 'calendar' ? 'all' : undefined);
	const phantomTxs = useCreatePhantomTxs();

	const sortedTxs = useMemo(() => {
		return dbTxs.concat(phantomTxs);
	}, [dbTxs, phantomTxs]);

	return sortedTxs;
};

export * from './types.d';
export default useTransactions;
