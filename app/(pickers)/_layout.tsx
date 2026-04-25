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
			{/* Every currency selection screen goes here:
			 * - Settings/Default Currency
			 * - Settings/Recalc Currency
			 * - Add Subscription/Base Currency
			 **/}
			<Stack.Screen
				name="select-currency"
				options={{
					title: 'Pick Currency',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="select-category"
				options={{
					title: 'Pick Category',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="select-tender"
				options={{
					title: 'Pick Payment Method',
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="edit-event"
				options={{
					title: 'Timeline Event',
					...sharedScreenConfig,
					sheetAllowedDetents: 'fitToContents'
				}}
			/>
		</Stack>
	);
};

export default Layout;
