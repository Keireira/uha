import React, { useEffect } from 'react';
import appModel from '@models';
import { useFonts } from 'expo-font';
import { withFactory, useFactoryModel } from '@lib/effector';
import * as SplashScreen from 'expo-splash-screen';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';
import SqlMigrations from '@src/sql-migrations';
import SyncSettings from '@src/sync-settings';
import '@src/i18n';

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

	const [loaded] = useFonts({
		Nunito: require('@assets/fonts/Nunito/Nunito-VariableFont_wght.ttf')
	});

	useEffect(() => {
		if (!loaded) return;

		SplashScreen.hideAsync();
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SqlMigrations />
				<SyncSettings />

				<Stack
					screenOptions={{
						headerShown: false,
						animation: 'none',
						navigationBarHidden: true
					}}
				>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="(crossroad)" options={{ headerShown: false }} />
				</Stack>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

const WrappedRoot = withFactory({
	Component: RootLayout,
	factory: appModel
});

export default WrappedRoot;
