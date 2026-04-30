import React from 'react';
import { useRouter } from 'expo-router';

import { font } from '@expo/ui/swift-ui/modifiers';
import { Host, Button, Grid } from '@expo/ui/swift-ui';

const LibraryScreen = () => {
	const router = useRouter();

	return (
		<Host style={{ flex: 1 }}>
			<Grid>
				<Button
					modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}
					label="Categories"
					onPress={() => router.replace('/(tabs)/library/categories-list')}
				/>
				<Button
					modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}
					label="Services"
					onPress={() => router.replace('/(tabs)/library/services-list')}
				/>
				<Button
					modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}
					label="Payment methods"
					onPress={() => router.replace('/(tabs)/library/payments-list')}
				/>
				<Button
					modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}
					label="Subscriptions"
					onPress={() => router.replace('/(tabs)/library/subscriptions-list')}
				/>
			</Grid>
		</Host>
	);
};

export default LibraryScreen;
