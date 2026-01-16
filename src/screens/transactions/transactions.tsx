import React, { useState } from 'react';
import { startOfMonth } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import { useAppModel } from '@models';

import TxHeader from './tx-header';
import TransactionsList from './txs-list';
import TransactionsCalendar from './txs-calendar';

import Root from './transactions.styles';

const Transactions = () => {
	const insets = useSafeAreaInsets();

	const appModel = useAppModel();
	const viewMode = useUnit(appModel.viewMode.$mode);

	const [activeMonth, setActiveMonth] = useState<Date>(startOfMonth(new Date()));

	return (
		<Root $top={insets.top}>
			<TxHeader activeMonth={activeMonth} />

			{viewMode === 'list' && <TransactionsList />}
			{viewMode === 'calendar' && <TransactionsCalendar activeMonth={activeMonth} setActiveMonth={setActiveMonth} />}
		</Root>
	);
};

export default Transactions;
