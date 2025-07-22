import React from 'react';
import { useScrollDirection } from '@hooks';

import { Wrapper, Text } from '@ui';
import Root from './categories.styles';

const CategoriesScreen = () => {
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<Text>All Categories List</Text>
		</Wrapper>
	);
};

export default CategoriesScreen;
