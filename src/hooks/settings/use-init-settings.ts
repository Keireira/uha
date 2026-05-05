import { useState, useEffect } from 'react';
import { useLocales, useCalendars } from 'expo-localization';
import { Settings, Appearance } from 'react-native';

import db, { silentDb } from '@db';
import { userTable } from '@db/schema';

import { USER_ID } from '@db/constants';
import { deserialize, serializeForNS } from './shared';
import { cache, useSettingsValue } from './use-settings';

import type { UserT } from '@models';
import type { UserKey } from './shared';

const hydrateSettings = (dbRow: UserT | undefined, defaults: Partial<Omit<UserT, 'id'>>) => {
	const keys = Object.keys(defaults) as UserKey[];

	for (const key of keys) {
		const rawValue = dbRow?.[key] ?? Settings.get(key) ?? defaults[key];

		cache.set(key, deserialize(key, rawValue));
	}

	if (!dbRow) {
		const row = {
			id: USER_ID,
			...defaults
		} as UserT;

		silentDb.insert(userTable).values(row).execute().catch(console.warn);
	}

	const nsPayload: Record<string, any> = {};
	for (const key of keys) {
		nsPayload[key] = serializeForNS(key, cache.get(key));
	}
	Settings.set(nsPayload);
};

const useSyncSettings = () => {
	const theme = useSettingsValue<'auto' | 'dark' | 'light'>('theme');

	useEffect(() => {
		if (theme === 'auto' || !theme) {
			if (__DEV__) {
				console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mSetup system color scheme\x1b[0m`);
			}

			Appearance.setColorScheme('unspecified');
			return;
		}

		if (__DEV__) {
			console.log(`\x1b[34m[SYNC SETTINGS]: \x1b[35mSetup color scheme to \x1b[0m(${theme})`);
		}

		Appearance.setColorScheme(theme);
	}, [theme]);
};

const useInitSettings = () => {
	const [locale] = useLocales();
	const [calendar] = useCalendars();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;

		const defaults: Partial<Omit<UserT, 'id'>> = {
			theme: 'auto',
			oled_mode: false,
			max_horizon: 2,
			first_day: calendar.firstWeekday === 1 ? 'sunday' : 'monday',
			ai_enabled: false,
			is_unlimited: false,
			accent: 'orange',
			default_currency: locale.currencyCode || 'USD',
			recalc_currency: 'USD',
			appstore_country: locale.regionCode || 'US',
			playstore_country: locale.regionCode || 'US',
			playstore_lang: locale.languageCode || 'en',
			search_sources: ['inhouse', 'appstore', 'web']
		};

		const row = db.select().from(userTable).limit(1).get();

		hydrateSettings(row, defaults);

		setIsReady(true);
	}, [isReady]);

	useSyncSettings();

	return isReady;
};

export default useInitSettings;
