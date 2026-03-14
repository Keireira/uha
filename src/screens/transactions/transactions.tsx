import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTransactions, useSearchParams } from '@hooks';

import TxHeader from './tx-header';
import Summaries from './summaries';
import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

import Root from './transactions.styles';

const Transactions = () => {
	const insets = useSafeAreaInsets();
	const { txViewMode, calendarScale } = useSearchParams();
	/* @TODO: Move to effector?? */
	const transactions = useTransactions('From Transactions');

	const withSummaries = txViewMode === 'list' || calendarScale === 'month';

	return (
		<Root $top={insets.top}>
			<TxHeader />

			{withSummaries && <Summaries />}

			{txViewMode === 'list' && <TransactionsList transactions={transactions} />}
			{txViewMode === 'calendar' && <TransactionsCalendar transactions={transactions} />}
		</Root>
	);
};

export default Transactions;
