import React from 'react';

import { H2 } from '@ui';
import Root, { EmptyView } from './txs-at-day.styles';
import TransactionCard from '@screens/transactions/txs-list/transactions/transaction-card';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const Empty = () => (
	<Root>
		<EmptyView>
			<H2 $color="#a1a1a6">No transactions</H2>
		</EmptyView>
	</Root>
);

const TxsAtDay = ({ txs }: { txs: PreparedDbTxT[] }) => {
	if (!txs || txs.length === 0) {
		return <Empty />;
	}

	return (
		<Root>
			{txs.map((tx) => (
				<TransactionCard key={tx.id} {...tx} />
			))}
		</Root>
	);
};

export default TxsAtDay;
