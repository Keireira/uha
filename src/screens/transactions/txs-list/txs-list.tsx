import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Lenses from './lenses';
import Summaries from './summaries';
import Transactions from './transactions';
import { LinearGradient } from 'expo-linear-gradient';
import Root, { Masked } from './txs-list.styles';

const TxsList = () => {
	const insets = useSafeAreaInsets();

	return (
		<Root $top={insets.top} $bottom={insets.bottom}>
			<Lenses />

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
		</Root>
	);
};

export default TxsList;
