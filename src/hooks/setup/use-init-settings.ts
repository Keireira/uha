import { useState, useEffect } from 'react';
import { Settings } from 'react-native';

import db from '@db';
import { userTable } from '@db/schema';

import { setSettingsValue } from '../use-settings';

const useInitSettings = () => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;

		const execute = async () => {
			const userData = await db.select().from(userTable).limit(1).get();
			const { theme, oled_mode, max_horizon, recalc_currency, default_currency, is_unlimited, accent, first_day } =
				userData || {};

			const initTheme = Settings.get('theme');
			const initOledMode = Settings.get('oled_mode');
			const initMaxHorizon = Settings.get('max_horizon');
			const initRecalcCurrency = Settings.get('recalc_currency');
			const initDefaultCurrency = Settings.get('default_currency');
			const initIsUnlimited = Settings.get('is_unlimited');
			const initFirstDay = Settings.get('first_day');
			const initAccent = Settings.get('accent');

			if (initTheme === undefined) {
				setSettingsValue('theme', theme);
			}

			if (initOledMode === undefined) {
				setSettingsValue('oled_mode', oled_mode);
			}

			if (initMaxHorizon === undefined) {
				setSettingsValue('max_horizon', max_horizon);
			}

			if (initRecalcCurrency === undefined) {
				setSettingsValue('recalc_currency', recalc_currency);
			}

			if (initDefaultCurrency === undefined) {
				setSettingsValue('default_currency', default_currency);
			}

			if (initIsUnlimited === undefined) {
				setSettingsValue('is_unlimited', is_unlimited ?? false);
			}

			if (!initFirstDay) {
				setSettingsValue('first_day', first_day);
			}

			if (!initAccent) {
				setSettingsValue('accent', accent);
			}

			setIsReady(true);
		};

		execute();
	}, []);

	return isReady;
};

export default useInitSettings;
