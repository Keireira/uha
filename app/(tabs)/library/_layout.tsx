import React from 'react';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams } from 'expo-router';

import type { StackScreenProps } from 'expo-router';

const useGetSharedConfig = () => {
	const theme = useTheme();
	const { title } = useLocalSearchParams<{ title?: string }>();

	const config: StackScreenProps['options'] = {
		gestureEnabled: true,
		presentation: 'card',
		sheetLargestUndimmedDetentIndex: 'none',
		sheetGrabberVisible: false,
		sheetCornerRadius: -1,
		sheetAllowedDetents: [1.0],
		headerBackButtonDisplayMode: 'minimal',

		contentStyle: {
			backgroundColor: theme.background.default
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
			<Stack.Screen
				name="index"
				options={{
					...sharedScreenConfig,
					title: 'Settings',
					headerTitleStyle: {
						color: 'transparent'
					},
					animation: 'fade',
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false
				}}
			/>

			<Stack.Screen
				name="categories-list"
				options={{
					title: 'All Categories',
					...sharedScreenConfig,
					presentation: 'card',
					animation: 'slide_from_right',
					headerTransparent: true
				}}
			/>
			<Stack.Screen
				name="services-list"
				options={{
					title: 'Services',
					...sharedScreenConfig,
					presentation: 'card',
					animation: 'slide_from_right',
					headerTransparent: true
				}}
			/>
			<Stack.Screen
				name="payments-list"
				options={{
					title: 'Payments',
					...sharedScreenConfig,
					presentation: 'card',
					animation: 'slide_from_right',
					headerTransparent: true
				}}
			/>
			<Stack.Screen
				name="subscriptions-list"
				options={{
					title: 'Subscriptions',
					...sharedScreenConfig,
					presentation: 'card',
					animation: 'slide_from_right',
					headerTransparent: true
				}}
			/>

			<Stack.Screen
				name="[id]"
				options={{
					title: 'Details',
					...sharedScreenConfig,
					headerTransparent: true,
					headerLargeTitleEnabled: true,
					headerLargeTitleShadowVisible: true,
					presentation: 'card'
				}}
			/>
		</Stack>
	);
};

export default Layout;
