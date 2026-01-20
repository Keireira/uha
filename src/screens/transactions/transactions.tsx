import React from 'react';
import { useUnit } from 'effector-react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import useTransactions from '@hooks/use-transactions';

import TxHeader from './tx-header';
import Summaries from './summaries';
import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

import Root from './transactions.styles';

const Transactions = () => {
	const insets = useSafeAreaInsets();
	/* @TODO: Move to effector?? */
	const transactions = useTransactions('Transactions');

	const { view_mode } = useAppModel();
	const viewMode = useUnit(view_mode.$mode);
	const calendarScale = useUnit(view_mode.calendar.$scale);

	const withSummaries = viewMode === 'list' || calendarScale === 'month';

	return (
		<Root $top={insets.top}>
			<TxHeader />

			{withSummaries && <Summaries />}

			{viewMode === 'list' && <TransactionsList transactions={transactions} />}
			{viewMode === 'calendar' && <TransactionsCalendar transactions={transactions} />}
		</Root>
	);
};

export default Transactions;
