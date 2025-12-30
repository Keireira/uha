import React from 'react';

import TransactionCard from './transaction-card';
import Root from './transactions.styles';

const Transactions = () => {
	return (
		<Root>
			{Array.from({ length: 33 }, (_, index) => (
				<TransactionCard key={index} />
			))}
		</Root>
	);
};

export default Transactions;
