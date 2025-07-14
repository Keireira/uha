import React from 'react';
import styled from 'styled-components/native';

import { Text, Wrapper } from '@ui';

const Container = styled.View`
	flex: 1;
	background-color: red;
`;

const Index = () => {
	return (
		<Container>
			<Wrapper>
				<Text>Index page</Text>
			</Wrapper>
		</Container>
	);
};

export default Index;
