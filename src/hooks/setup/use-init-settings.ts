import { useState, useEffect } from 'react';
import { Settings } from 'react-native';

import db from '@db';
import { userTable } from '@db/schema';
import { setSettingsValue } from '../use-settings';

import type { UserT } from '@models';

type UserKey =
	| 'theme'
	| 'oled_mode'
	| 'max_horizon'
	| 'recalc_currency'
	| 'default_currency'
	| 'first_day'
	| 'ai_enabled'
	| 'is_unlimited'
	| 'accent';

const SETTINGS_KEYS: UserKey[] = [
	'theme',
	'oled_mode',
	'max_horizon',
	'recalc_currency',
	'default_currency',
	'first_day',
	'ai_enabled',
	'is_unlimited',
	'accent'
];

const DEFAULTS: Partial<Omit<UserT, 'id'>> = {
	theme: 'auto',
	oled_mode: false,
	max_horizon: 3,
	first_day: 'monday',
	ai_enabled: false,
	is_unlimited: false,
	accent: 'orange'
};

const useInitSettings = () => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;

		const userData = db.select().from(userTable).limit(1).get();

		SETTINGS_KEYS.forEach((settingKey) => {
			const currentValue = Settings.get(settingKey);

			console.log('currentValue:', currentValue, typeof currentValue);

			if (currentValue === undefined || currentValue === null) {
				const possibleValue = userData?.[settingKey] ?? DEFAULTS[settingKey];

				setSettingsValue(settingKey, possibleValue);
			}
		});

		setIsReady(true);
	}, [isReady]);

	return isReady;
};

export default useInitSettings;
