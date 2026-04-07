import { useState, useEffect } from 'react';
import { Settings } from 'react-native';
import { useLocales, useCalendars } from 'expo-localization';

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

const useGetDefaultValues = () => {
	const [locale] = useLocales();
	const [calendar] = useCalendars();

	const DEFAULTS: Partial<Omit<UserT, 'id'>> = {
		theme: 'auto',
		oled_mode: false,
		max_horizon: 3,
		first_day: calendar.firstWeekday === 1 ? 'sunday' : 'monday',
		ai_enabled: false,
		is_unlimited: false,
		accent: 'orange',
		default_currency: 'USD',
		recalc_currency: locale.currencyCode || 'USD',
		appstore_country: locale.regionCode || 'US',
		playstore_country: locale.regionCode || 'US',
		playstore_lang: locale.languageCode || 'en',
		search_sources: ['inhouse', 'appstore', 'playstore', 'web', 'brandfetch', 'logodev']
	};

	return DEFAULTS;
};

const useInitSettings = () => {
	const defaults = useGetDefaultValues();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;

		const userData = db.select().from(userTable).limit(1).get();

		SETTINGS_KEYS.forEach((settingKey) => {
			const currentValue = userData?.[settingKey] ?? Settings.get(settingKey);

			if (currentValue === undefined || currentValue === null) {
				let possibleValue = userData?.[settingKey] ?? defaults[settingKey];

				setSettingsValue(settingKey, possibleValue);
			}
		});

		setIsReady(true);
	}, [defaults, isReady]);

	return isReady;
};

export default useInitSettings;
