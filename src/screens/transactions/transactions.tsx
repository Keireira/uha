import React from 'react';

import { useTransactions, useSearchParams } from '@hooks';

import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';
import Root from './transactions.styles';

const Transactions = () => {
	const { txViewMode } = useSearchParams();
	/* @TODO: Move to effector/zustand? */
	const transactions = useTransactions('From Transactions');

	if (txViewMode === 'list') {
		return <TransactionsList transactions={transactions} />;
	}

	if (txViewMode === 'calendar') {
		return (
			<Root>
				<TransactionsCalendar transactions={transactions} />
			</Root>
		);
	}

	return null;
};

export default Transactions;
