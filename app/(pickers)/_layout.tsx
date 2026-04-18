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
		</Stack>
	);
};

export default Layout;
