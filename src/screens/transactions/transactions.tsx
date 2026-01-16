import React from 'react';
import { useUnit } from 'effector-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';

import TxHeader from './tx-header';
import Summaries from './summaries';
import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

import Root from './transactions.styles';

const Transactions = () => {
	const insets = useSafeAreaInsets();

	const appModel = useAppModel();
	const viewMode = useUnit(appModel.view_mode.$mode);

	return (
		<Root $top={insets.top}>
			<TxHeader />

			<Summaries />

			{viewMode === 'list' && <TransactionsList />}
			{viewMode === 'calendar' && <TransactionsCalendar />}
		</Root>
	);
};

export default Transactions;
