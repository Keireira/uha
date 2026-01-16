import React from 'react';

import Summaries from './summaries';
import Transactions from './transactions';
import { LinearGradient } from 'expo-linear-gradient';
import { Masked } from './txs-list.styles';

const TxsList = () => {
	return (
		<>
			<Summaries />

			<Masked
				maskElement={
					<LinearGradient
						colors={['transparent', 'black', 'black']}
						locations={[0, 0.03, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={{ flex: 1 }}
					/>
				}
			>
				<Transactions />
			</Masked>
		</>
	);
};

export default TxsList;
