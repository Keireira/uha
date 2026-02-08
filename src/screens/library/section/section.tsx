import React from 'react';
import { useRouter } from 'expo-router';

import Root, { HeaderLink, Title, Rule } from './section.styles';

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
				<Rule />
			</HeaderLink>

			{children}
		</Root>
	);
};

export default Section;
