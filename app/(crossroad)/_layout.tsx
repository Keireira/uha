import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import type { StackScreenProps } from 'expo-router';

const useGetSharedConfig = () => {
	const theme = useTheme();

	return {
		gestureEnabled: true,
		presentation: 'formSheet',
		sheetAllowedDetents: [1.0],
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
	const { t } = useTranslation();
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
		</Stack>
	);
};

export default Layout;
