import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native';
import appModel from '@models';
import { useFonts } from 'expo-font';
import { withFactory, useFactoryModel } from '@lib/effector';
import * as SplashScreen from 'expo-splash-screen';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRootNavigationState } from 'expo-router';
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
	const navigation = useRootNavigationState();

	/* Mocks */
	const seeded = useSetupMocks(areMigrationsReady);

	const [loaded] = useFonts({
		Nunito: require('@assets/fonts/Nunito/Nunito-VariableFont_wght.ttf')
	});

	const isAppReadyToGo = useMemo(() => {
		return loaded && seeded && areMigrationsReady && navigation?.key;
	}, [loaded, seeded, areMigrationsReady, navigation?.key]);

	useEffect(() => {
		if (!isAppReadyToGo) return;

		SplashScreen.hideAsync();
	}, [isAppReadyToGo]);

	if (!isAppReadyToGo) {
		return null;
	}

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				{/* @TODO: Move to hooks & preload as well */}
				<SyncSettings />

				<ThemeProvider theme={theme}>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: 'none',
							navigationBarHidden: true
						}}
						initialRouteName="index"
					>
						<Stack.Screen name="index" />
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(crossroad)" options={{ headerShown: false }} />
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
