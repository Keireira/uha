import React from 'react';
import { View } from 'react-native';
import { useScrollDirection } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Lenses from './lenses';
import { H2 } from '@ui';
import { LinearGradient } from 'expo-linear-gradient';
import Root, { Masked, ContentView, BottomSpacer, Item } from './subs-list.styles';

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
					<View
						style={{
							flexDirection: 'column',
							marginHorizontal: 12,
							gap: 16
						}}
					>
						{Array.from({ length: 100 }, (_, index) => (
							<Item key={index}>
								<H2>TEST TEXT {`${index + 1}`.padStart(3, '0')}</H2>
							</Item>
						))}
					</View>

					<BottomSpacer $bottom={insets.bottom} />
				</ContentView>
			</Masked>
		</Root>
	);
};

export default SubsList;
