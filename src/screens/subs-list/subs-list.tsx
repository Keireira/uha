import React from 'react';
import { useScrollDirection } from '@hooks';

import Lenses from './lenses';
import { Wrapper, Text } from '@ui';
import Root from './subs-list.styles';

const SubsList = () => {
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<Lenses/>
		</Wrapper>
	);
};

export default SubsList;
