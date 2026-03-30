import React from 'react';

import { useTransactions, useSearchParams } from '@hooks';

import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';
import Root from './transactions.styles';

const Transactions = () => {
	const { txViewMode } = useSearchParams();
	/* @TODO: Move to effector?? */
	const transactions = useTransactions('From Transactions');

	if (txViewMode === 'list') {
		return <TransactionsList transactions={transactions} />;
	}

	return (
		<Root>
			<TransactionsCalendar transactions={transactions} />
		</Root>
	);
};

export default Transactions;
