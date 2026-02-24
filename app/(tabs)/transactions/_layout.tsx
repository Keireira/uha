import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { HeaderLeft, HeaderRight, HeaderBackground } from '@screens/transactions/filters/components/header/header';

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
					headerShown: true,
					title: 'Filters',
					headerTransparent: true,
					headerBlurEffect: 'none',
					headerTintColor: theme.text.primary,
					headerShadowVisible: false,
					headerLeft: () => <HeaderLeft />,
					headerBackground: () => <HeaderBackground />,
					headerRight: () => <HeaderRight />,

					gestureEnabled: true,
					presentation: 'formSheet',
					headerSearchBarOptions: {
						placeholder: 'Search',
						barTintColor: theme.background.secondary,
						tintColor: theme.text.primary,
						hideNavigationBar: true,
						autoFocus: false,
						autoCapitalize: 'none',
						disableBackButtonOverride: true
						// onChangeText: (e: { nativeEvent: { text: string } }) => {
						// 	setSearchQuery(e.nativeEvent.text);
						// }
					},
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
