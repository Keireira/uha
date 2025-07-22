import React from 'react';
import { useRouter } from 'expo-router';

import { ArrowRightIcon } from '@ui/icons';
import { LinearGradient } from 'expo-linear-gradient';
import Root, { HeaderLink, Title } from './section.styles';
import MaskedView from '@react-native-masked-view/masked-view';

import type { Props } from './section.d';

const Section = ({ children, title, to }: Props) => {
	const router = useRouter();

	const navigateTo = () => {
		if (!to) return;

		router.push(to);
	};

	return (
		<Root>
			<HeaderLink hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<Title>{title}</Title>

				<ArrowRightIcon width={18} height={18} color="#333" />
			</HeaderLink>

			<MaskedView
				style={{ marginLeft: -12, marginRight: -12 }}
				maskElement={
					<LinearGradient
						colors={['transparent', 'black', 'black', 'transparent']}
						locations={[0, 0.04, 0.96, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={{ flex: 1 }}
					/>
				}
			>
				{children}
			</MaskedView>
		</Root>
	);
};

export default Section;
