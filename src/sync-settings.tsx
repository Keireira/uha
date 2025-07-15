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

	useEffect(() => {
		const showFractions = Settings.get('currency_fractions'); // '1' for true, '0' for false

		if (![0, 1].includes(showFractions)) {
			Settings.set({ currency_fractions: 0 });
		}
	}, []);

	useEffect(() => {
		const defaultCurrency = Settings.get('default_currency_code');
		const recalcCurrency = Settings.get('recalc_currency_code');

		if (!defaultCurrency || !recalcCurrency) {
			Settings.set({ default_currency_code: 'USD', recalc_currency_code: 'USD' });
		}
	}, []);

	return null;
};

export default SyncSettings;
