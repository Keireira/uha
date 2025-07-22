import React from 'react';
import { useScrollDirection } from '@hooks';

import { Wrapper, Text } from '@ui';
import Root from './payments.styles';

const PaymentsScreen = () => {
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<Text>All Payments List</Text>
		</Wrapper>
	);
};

export default PaymentsScreen;
