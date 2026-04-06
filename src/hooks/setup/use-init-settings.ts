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
	| 'accent'
	| 'appstore_country'
	| 'playstore_country'
	| 'playstore_lang'
	| 'search_sources';

const SETTINGS_KEYS: UserKey[] = [
	'theme',
	'oled_mode',
	'max_horizon',
	'recalc_currency',
	'default_currency',
	'first_day',
	'ai_enabled',
	'is_unlimited',
	'accent',
	'appstore_country',
	'playstore_country',
	'playstore_lang',
	'search_sources'
];

const DEFAULTS: Partial<Omit<UserT, 'id'>> = {
	theme: 'auto',
	oled_mode: false,
	max_horizon: 3,
	first_day: 'monday',
	ai_enabled: false,
	is_unlimited: false,
	accent: 'orange',
	appstore_country: 'US',
	playstore_country: 'US',
	playstore_lang: 'en',
	search_sources: ['appstore', 'playstore', 'web', 'brandfetch', 'logo.dev']
};

const useInitSettings = () => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;

		const userData = db.select().from(userTable).limit(1).get();

		SETTINGS_KEYS.forEach((settingKey) => {
			const currentValue = Settings.get(settingKey);

			if (currentValue === undefined || currentValue === null) {
				let possibleValue = userData?.[settingKey] ?? DEFAULTS[settingKey];

				setSettingsValue(settingKey, possibleValue);
			}
		});

		setIsReady(true);
	}, [isReady]);

	return isReady;
};

export default useInitSettings;
