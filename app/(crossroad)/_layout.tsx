import React from 'react';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams } from 'expo-router';

import type { StackScreenProps } from 'expo-router';

const useGetSharedConfig = () => {
	const theme = useTheme();
	const { title } = useLocalSearchParams<{ title?: string }>();

	const config: StackScreenProps['options'] = {
		gestureEnabled: true,
		presentation: 'formSheet',
		sheetLargestUndimmedDetentIndex: 'none',
		sheetGrabberVisible: true,
		sheetCornerRadius: -1,
		animation: 'slide_from_bottom',
		sheetAllowedDetents: [1.0],

		contentStyle: {
			backgroundColor: theme.background.secondary
		}
	};

	if (title) {
		config.title = title;
	}

	return config satisfies StackScreenProps['options'];
};

const Layout = () => {
	const sharedScreenConfig = useGetSharedConfig();

	return (
		<Stack>
			<Stack.Screen name="index" />

			<Stack.Screen
				name="add-subscription"
				options={{
					title: 'New Subscription',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="edit-logo-sheet"
				options={{
					title: 'Color & Logo',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="color-presets"
				options={{
					...sharedScreenConfig,
					title: 'Color Presets',
					sheetAllowedDetents: [0.8]
				}}
			/>

			<Stack.Screen
				name="first-payment-date"
				options={{
					title: 'First Payment Date',
					...sharedScreenConfig,
					sheetAllowedDetents: 'fitToContents'
				}}
			/>

			<Stack.Screen
				name="billing-cycle"
				options={{
					title: 'Billing Cycle',
					...sharedScreenConfig,
					sheetAllowedDetents: 'fitToContents'
				}}
			/>

			<Stack.Screen
				name="trial-duration"
				options={{
					title: 'Trial Duration',
					...sharedScreenConfig,
					sheetAllowedDetents: 'fitToContents'
				}}
			/>

			<Stack.Screen
				name="add-category"
				options={{
					title: 'New Category',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="add-payment"
				options={{
					title: 'New Payment Method',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="notifications"
				options={{
					title: 'Notifications',
					...sharedScreenConfig,
					sheetAllowedDetents: [0.8, 1.0]
				}}
			/>

			<Stack.Screen
				name="edit-event"
				options={{
					title: 'Timeline Event',
					...sharedScreenConfig,
					sheetAllowedDetents: [0.6, 1.0]
				}}
			/>
		</Stack>
	);
};

export default Layout;
