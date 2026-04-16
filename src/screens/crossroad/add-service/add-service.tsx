import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, Header, Title } from './add-service.styles';

const AddServiceScreen = () => {
	const insets = useSafeAreaInsets();

	return (
		<Container
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
			<Header>
				<Title $dark={false}>New Service</Title>
			</Header>
		</Container>
	);
};

export default AddServiceScreen;
