import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

const Layout = () => {
	const theme = useTheme();

	return (
		<Stack screenOptions={{ headerShown: false, animation: 'none' }}>
			<Stack.Screen name="index" initialParams={{ tx_view_mode: 'list' }} />

			<Stack.Screen
				name="[transactionId]"
				options={{
					gestureEnabled: true,
					presentation: 'formSheet',
					sheetAllowedDetents: 'fitToContents',
					sheetLargestUndimmedDetentIndex: 'none',
					sheetGrabberVisible: true,
					sheetCornerRadius: -1,
					animation: 'slide_from_bottom',
					contentStyle: {
						backgroundColor: theme.background.secondary
					}
				}}
			/>

			<Stack.Screen
				name="filters"
				options={{
					headerShown: false,
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
				}}
			/>

			<Stack.Screen
				name="analytics"
				options={{
					gestureEnabled: true,
					presentation: 'formSheet',
					sheetAllowedDetents: [0.7, 0.92],
					sheetLargestUndimmedDetentIndex: 'none',
					sheetGrabberVisible: true,
					sheetCornerRadius: -1,
					animation: 'slide_from_bottom',
					contentStyle: {
						backgroundColor: theme.background.secondary
					}
				}}
			/>
		</Stack>
	);
};

export default Layout;
