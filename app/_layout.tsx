import React, { useEffect, useMemo } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRootNavigationState } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

// Notifications
import { setNotificationHandler } from 'expo-notifications';
import { useReconcileNotificationsOnForeground } from '@lib/notifications';

// Logging & Local Response
import { AppToast } from '@elements';
import { logger, ErrorBoundary } from '@lib/logger';

// Themes setup
import { useGetTheme } from '@themes';
import { useTheme } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';

// Setup
import { useInitSettings } from '@hooks/settings';
import { useSqlMigrations, useBackfillRates, useInitPurchases } from '@hooks/setup';

// Locale
import '@src/i18n';

logger.install();
SplashScreen.preventAutoHideAsync();

setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: false
	})
});

const LoadFinalStage = () => {
	useBackfillRates();
	useInitPurchases();
	useReconcileNotificationsOnForeground();

	const theme = useGetTheme();

	/* This is a hack (https://github.com/expo/expo/issues/33040#issuecomment-2495435678)
	 * When we swipe between cards in the stack, we experience a WHITE background underneath the screens.
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
