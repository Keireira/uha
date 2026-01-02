import React from 'react';
import { useScrollDirection } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Lenses from './lenses';
// import Summaries from './summaries';
import Transactions from './transactions';
import { LinearGradient } from 'expo-linear-gradient';
import Root, { Masked, ContentView } from './subs-list.styles';

const SubsList = () => {
	const handleScroll = useScrollDirection();
	const insets = useSafeAreaInsets();

	return (
		<Root $top={insets.top} $bottom={insets.bottom}>
			<Lenses />
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
				<ContentView onScroll={handleScroll}>
					{/* <Summaries /> */}

					<Transactions />
				</ContentView>
			</Masked>
		</Root>
	);
};

export default SubsList;
