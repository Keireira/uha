import React from 'react';
import { View } from 'react-native';

import { useTransactions, useSearchParams } from '@hooks';

import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

const Transactions = () => {
	const { txViewMode } = useSearchParams();
	/* @TODO: Move to effector?? */
	const transactions = useTransactions('From Transactions');

	if (txViewMode === 'list') {
		return <TransactionsList transactions={transactions} />;
	}

	return (
		<View style={{ flex: 1 }}>
			<TransactionsCalendar transactions={transactions} />
		</View>
	);
};

export default Transactions;
