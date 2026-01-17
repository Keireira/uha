import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import appModel from '@models';
import { useFonts } from 'expo-font';
import { withFactory, useFactoryModel } from '@lib/effector';
import * as SplashScreen from 'expo-splash-screen';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';
import SyncSettings from '@src/sync-settings';

import { useSetupMocks, useSqlMigrations } from '@hooks/setup';

import '@src/i18n';

import { useGetTheme } from '@themes';

SplashScreen.preventAutoHideAsync();

setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: false,
		shouldSetBadge: false
	})
});

const RootLayout = () => {
	useFactoryModel(appModel);
	const theme = useGetTheme();
	const areMigrationsReady = useSqlMigrations();

	/* Mocks */
	const seeded = useSetupMocks(areMigrationsReady);

	const [loaded] = useFonts({
		Nunito: require('@assets/fonts/Nunito/Nunito-VariableFont_wght.ttf')
	});

	const isReadyToGo = loaded && seeded && areMigrationsReady;

	useEffect(() => {
		if (!isReadyToGo) return;

		SplashScreen.hideAsync();
	}, [isReadyToGo]);

	if (!isReadyToGo) {
		return null;
	}

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SyncSettings />

				<ThemeProvider theme={theme}>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: 'none',
							navigationBarHidden: true
						}}
					>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					</Stack>
				</ThemeProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

const WrappedRoot = withFactory({
	Component: RootLayout,
	factory: appModel
});

export default WrappedRoot;
