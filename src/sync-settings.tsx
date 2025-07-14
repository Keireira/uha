import { useEffect } from 'react';
import { Settings, Appearance } from 'react-native';
import SettingsBridgeModule from '@modules/settings-bridge';

const SyncSettings = () => {
	useEffect(() => {
		const theme = Settings.get('theme');

		Appearance.setColorScheme(theme);

		SettingsBridgeModule.addListener('onThemeChanged', (event) => {
			Appearance.setColorScheme(event.newValue);
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onThemeChanged');
		};
	}, []);

	return null;
};

export default SyncSettings;
