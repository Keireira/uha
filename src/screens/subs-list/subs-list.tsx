import React from 'react';
import { useScrollDirection } from '@hooks';

import Lenses from './lenses';
import { H2 } from '@ui';
import { LinearGradient } from 'expo-linear-gradient';
import Root, { Masked, ContentView, BottomSpacer } from './subs-list.styles';

const SubsList = () => {
	const handleScroll = useScrollDirection();

	return (
		<Root>
			<Lenses />

			<Masked
				maskElement={
					<LinearGradient
						colors={['transparent', 'black', 'black', 'transparent']}
						locations={[0, 0.04, 0.92, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={{ flex: 1 }}
					/>
				}
			>
				<ContentView onScroll={handleScroll}>
					<H2>START START START START</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>TEST TEXT</H2>
					<H2>END END END END</H2>

					<BottomSpacer />
				</ContentView>
			</Masked>
		</Root>
	);
};

export default SubsList;
