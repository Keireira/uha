import React from 'react';
import { useRouter } from 'expo-router';

import { Divider } from '@ui';
import Root, { HeaderLink, Title } from './section.styles';

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

				<Divider gap={0} />
			</HeaderLink>

			{children}
		</Root>
	);
};

export default Section;
