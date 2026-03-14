import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

const Layout = () => {
	const theme = useTheme();

	return (
		<Stack screenOptions={{ headerShown: false, animation: 'none' }}>
			<Stack.Screen
				name="index"
				options={{
					title: 'Settings',
					headerTitleStyle: {
						color: 'transparent'
					},
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false
				}}
			/>

			<Stack.Screen
				name="select-currency"
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
		</Stack>
	);
};

export default Layout;
