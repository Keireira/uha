import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

import type { StackScreenProps } from 'expo-router';

const useGetSharedConfig = () => {
	const theme = useTheme();

	return {
		gestureEnabled: true,
		presentation: 'formSheet',
		sheetLargestUndimmedDetentIndex: 'none',
		sheetGrabberVisible: true,
		sheetCornerRadius: -1,
		animation: 'slide_from_bottom',

		contentStyle: {
			backgroundColor: theme.background.secondary
		}
	} satisfies StackScreenProps['options'];
};

const Layout = () => {
	const sharedScreenConfig = useGetSharedConfig();

	return (
		<Stack>
			<Stack.Screen
				name="select-currency"
				options={{
					title: 'Pick Currency',
					sheetAllowedDetents: [1.0],
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="first-payment-date"
				options={{
					title: 'First Payment Date',
					sheetAllowedDetents: 'fitToContents',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="billing-cycle"
				options={{
					title: 'Billing Cycle',
					sheetAllowedDetents: 'fitToContents',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="trial-duration"
				options={{
					title: 'Trial Duration',
					sheetAllowedDetents: 'fitToContents',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="select-category"
				options={{
					title: 'Pick Category',
					sheetAllowedDetents: [1.0],
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="select-tender"
				options={{
					title: 'Payment Method',
					sheetAllowedDetents: [1.0],
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="edit-event"
				options={{
					title: 'Timeline Event',
					sheetAllowedDetents: 'fitToContents',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="notifications"
				options={{
					title: 'Notifications',
					sheetAllowedDetents: 'fitToContents',
					...sharedScreenConfig
				}}
			/>
		</Stack>
	);
};

export default Layout;
