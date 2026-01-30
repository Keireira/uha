import { useEffect } from 'react';
import { Settings } from 'react-native';

import db from '@db';
import { userTable } from '@db/schema';

import { setSettingsValue } from '../use-settings';

const useInitSettings = () => {
	useEffect(() => {
		const execute = async () => {
			const userData = await db.select().from(userTable).limit(1).get();
			const { theme, oled_mode, max_horizon, with_color_grading, recalc_currency, default_currency } = userData || {};

			const initTheme = Settings.get('theme');
			const initOledMode = Settings.get('oled_mode');
			const initMaxHorizon = Settings.get('max_horizon');
			const initWithColorGrading = Settings.get('with_color_grading');
			const initRecalcCurrency = Settings.get('recalc_currency');
			const initDefaultCurrency = Settings.get('default_currency');

			if (initTheme === undefined) {
				setSettingsValue('theme', theme);
			}

			if (initOledMode === undefined) {
				setSettingsValue('oled_mode', oled_mode);
			}

			if (initMaxHorizon === undefined) {
				setSettingsValue('max_horizon', max_horizon);
			}

			if (initWithColorGrading === undefined) {
				setSettingsValue('with_color_grading', with_color_grading);
			}

			if (initRecalcCurrency === undefined) {
				setSettingsValue('recalc_currency', recalc_currency);
			}

			if (initDefaultCurrency === undefined) {
				setSettingsValue('default_currency', default_currency);
			}
		};

		execute();
	}, []);
};

export default useInitSettings;
