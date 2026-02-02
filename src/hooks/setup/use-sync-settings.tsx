import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { setSettingsValue, useSettingsValue } from '@hooks';
import SettingsBridgeModule from '@modules/settings-bridge';

const useSyncSettings = () => {
	const theme = useSettingsValue<'dark' | 'light'>('theme');
	const showFractions = useSettingsValue<boolean>('currency_fractions');
	const recalcCurrency = useSettingsValue<string>('recalc_currency_code');
	const defaultCurrency = useSettingsValue<string>('default_currency_code');

	useEffect(() => {
		Appearance.setColorScheme(theme);

		SettingsBridgeModule.addListener('onThemeChanged', (event) => {
			Appearance.setColorScheme(event.newValue);
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onThemeChanged');
		};
	}, [theme]);

	useEffect(() => {
		if (typeof showFractions !== 'boolean') {
			setSettingsValue('currency_fractions', true);
		}
	}, [showFractions]);

	useEffect(() => {
		if (!defaultCurrency || !recalcCurrency) {
			setSettingsValue('default_currency_code', 'USD');
			setSettingsValue('recalc_currency_code', 'USD');
		}
	}, [defaultCurrency, recalcCurrency]);
};

export default useSyncSettings;
