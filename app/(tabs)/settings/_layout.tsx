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
				name="pick-a-store-apple"
				options={{
					title: t('settings.sources.appstore'),
					...sharedScreenConfig
				}}
			/>

			<Stack.Screen
				name="pick-a-store"
				options={{
					title: t('settings.sources.playstore'),
					...sharedScreenConfig
				}}
			/>
		</Stack>
	);
};

export default Layout;
