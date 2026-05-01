import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native';
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
import { useTheme } from '@react-navigation/native';

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

	/* This is a hack (https://github.com/expo/expo/issues/33040#issuecomment-2495435678)
	 * When we swipe between cards in the stack, we experience a WHITE background underneat the screens.
	 * I tried to:
	 * - change backgroundColor in app.json;
	 * - set backgroundColor in the contentStyle
	 * - use transparentModal
	 * - use expo-system-ui
	 *
	 * Nothing has been worked but this
	 */
	const RNTheme = useTheme();
	RNTheme.colors.background = theme.background.default;

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

							<Stack.Screen
								name="(tabs)"
								options={{
									headerShown: false
								}}
							/>

							<Stack.Screen
								name="(pickers)"
								options={{
									presentation: 'formSheet',
									animation: 'slide_from_bottom'
								}}
							/>

							<Stack.Screen
								name="(crossroad)"
								options={{
									freezeOnBlur: true,
									presentation: 'formSheet',
									animation: 'slide_from_bottom'
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
	const navigation = useRootNavigationState();

	const isAppReadyToGo = useMemo(() => {
		return areSettingsReady && navigation?.key;
	}, [areSettingsReady, navigation?.key]);

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
