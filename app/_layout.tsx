import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { initialWindowMetrics, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRootNavigationState } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';

import Toast from 'react-native-toast-message';
import { logger, ErrorBoundary } from '@lib/logger';

import { useInitSettings } from '@hooks/settings';
import { useSqlMigrations, useBackfillRates, useInitPurchases } from '@hooks/setup';

import '@src/i18n';

import { useGetTheme } from '@themes';
import { toastConfig } from '@elements';

logger.install();

SplashScreen.preventAutoHideAsync();

setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: false,
		shouldSetBadge: false
	})
});

const AppToast = () => {
	const insets = useSafeAreaInsets();

	return <Toast config={toastConfig} topOffset={insets.top} />;
};

const LoadFinalStage = () => {
	useBackfillRates();
	useInitPurchases();
	const theme = useGetTheme();

	useEffect(() => {
		if (!theme) return;

		SplashScreen.hideAsync();
	}, [theme]);

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider theme={theme}>
					<ErrorBoundary>
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

							<Stack.Screen
								name="(crossroad)"
								options={{
									headerShown: false,
									presentation: 'formSheet',
									gestureEnabled: true,
									sheetAllowedDetents: [0.7, 0.92],
									sheetLargestUndimmedDetentIndex: 'none',
									sheetGrabberVisible: true,
									sheetCornerRadius: -1,
									animation: 'slide_from_bottom',
									contentStyle: { backgroundColor: theme.background.default }
								}}
							/>
						</Stack>

						<AppToast />
					</ErrorBoundary>
				</ThemeProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

const LoadStageTwo = () => {
	const areSettingsReady = useInitSettings();

	const [fontsLoaded] = useFonts({
		Nunito: require('@assets/fonts/Nunito/Nunito-VariableFont_wght.ttf')
	});

	const navigation = useRootNavigationState();

	const isAppReadyToGo = useMemo(() => {
		return fontsLoaded && areSettingsReady && navigation?.key;
	}, [fontsLoaded, areSettingsReady, navigation?.key]);

	if (!isAppReadyToGo) {
		return null;
	}

	return <LoadFinalStage />;
};

const RootLayout = () => {
	const areMigrationsReady = useSqlMigrations();

	if (!areMigrationsReady) {
		return null;
	}

	return <LoadStageTwo />;
};

export default RootLayout;
