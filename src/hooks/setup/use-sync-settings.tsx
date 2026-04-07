import { useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';

import { setSettingsValue, useSettingsValue } from '@hooks';
import SettingsBridgeModule from '@modules/settings-bridge';

const useSyncSettings = () => {
	const colorScheme = useColorScheme();
	const theme = useSettingsValue<'auto' | 'dark' | 'light'>('theme');

	useEffect(() => {
		if (__DEV__) {
			console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mtheme \x1b[0m(${theme})`);
			console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mcolorScheme \x1b[0m(${colorScheme})`);
		}

		if (theme === 'auto' || !theme) {
			if (__DEV__) {
				console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mSetup settings value\x1b[0m`);
			}

			setSettingsValue('theme', colorScheme);
		}

		if (theme !== colorScheme && theme && theme !== 'auto') {
			if (__DEV__) {
				console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mSetup color scheme to \x1b[0m(${theme})`);
			}

			Appearance.setColorScheme(theme);
		}

		SettingsBridgeModule.addListener('onThemeChanged', (event) => {
			if (__DEV__) {
				console.log(`\x1b[34m[ACTION] \x1b[35m[onThemeChanged] \x1b[0m(${event.newValue})`);
			}

			Appearance.setColorScheme(event.newValue);
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onThemeChanged');
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, []);
};

export default useSyncSettings;
