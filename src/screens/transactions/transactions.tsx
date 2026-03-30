import React from 'react';

import { useTransactions, useSearchParams } from '@hooks';

import TxHeader from './tx-header';
import Summaries from './summaries';
import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

import Root from './transactions.styles';

const Transactions = () => {
	const { txViewMode, calendarScale } = useSearchParams();
	/* @TODO: Move to effector?? */
	const transactions = useTransactions('From Transactions');

	const withSummaries = txViewMode === 'list' || calendarScale === 'month';

	return (
		<Root>
			<TxHeader />

			{withSummaries && <Summaries />}

			{txViewMode === 'list' && <TransactionsList transactions={transactions} />}
			{txViewMode === 'calendar' && <TransactionsCalendar transactions={transactions} />}
		</Root>
	);
};

export default Transactions;
