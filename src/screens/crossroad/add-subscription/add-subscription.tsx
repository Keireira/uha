import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@ui';
import { useLoadService } from './hooks';

import { Container } from './add-subscription.styles';

const AddSubscriptionScreen = () => {
	const insets = useSafeAreaInsets();
	const { service, isLoading } = useLoadService();

	if (isLoading) {
		return null;
	}

	return (
		<Container
			style={{ backgroundColor: service?.color }}
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
			<Text>{service?.title}</Text>
			<Text>{service?.category_slug}</Text>
		</Container>
	);
};

export default AddSubscriptionScreen;
