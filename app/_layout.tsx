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

import {
	useSetupMocks,
	useSqlMigrations,
	useBackfillRates,
	useFillUpMissedTxs,
	useInitSettings,
	useSyncSettings
} from '@hooks/setup';

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

const LoadFinalStage = () => {
	useBackfillRates();
	const theme = useGetTheme();

	useEffect(() => {
		if (!theme) return;

		SplashScreen.hideAsync();
	}, [theme]);

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<GestureHandlerRootView style={{ flex: 1 }}>
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

const LoadStageTwo = () => {
	useInitSettings();
	useSyncSettings();
	const seeded = useSetupMocks();

	const [fontsLoaded] = useFonts({
		Nunito: require('@assets/fonts/Nunito/Nunito-VariableFont_wght.ttf')
	});

	const navigation = useRootNavigationState();
	const areTxsFilled = useFillUpMissedTxs(seeded);

	const isAppReadyToGo = useMemo(() => {
		return seeded && areTxsFilled && fontsLoaded && navigation?.key;
	}, [seeded, areTxsFilled, fontsLoaded, navigation?.key]);

	if (!isAppReadyToGo) {
		return null;
	}

	return <LoadFinalStage />;
};

const LoadStageOne = () => {
	useFactoryModel(appModel);
	const areMigrationsReady = useSqlMigrations();

	if (!areMigrationsReady) {
		return null;
	}

	return <LoadStageTwo />;
};

const RootLayout = withFactory({
	Component: LoadStageOne,
	factory: appModel
});

export default RootLayout;
