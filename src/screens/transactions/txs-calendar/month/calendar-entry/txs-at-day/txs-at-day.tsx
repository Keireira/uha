import React from 'react';

import Root, { EmptyView, EmptyText } from './txs-at-day.styles';
import { TransactionCard } from '@screens/transactions/txs-list/components';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const Empty = () => (
	<Root>
		<EmptyView>
			<EmptyText>No transactions</EmptyText>
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
