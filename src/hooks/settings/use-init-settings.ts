import { useState, useEffect } from 'react';
import { useLocales, useCalendars } from 'expo-localization';
import { Settings, Appearance, useColorScheme } from 'react-native';

import db, { silentDb } from '@db';
import { userTable } from '@db/schema';
import SettingsBridgeModule from '@modules/settings-bridge';

import { deserialize, serializeForNS, USER_ID } from './shared';
import { cache, setSettingsValue, useSettingsValue } from './use-settings';

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
	const colorScheme = useColorScheme();
	const theme = useSettingsValue<'auto' | 'dark' | 'light'>('theme');

	useEffect(() => {
		SettingsBridgeModule.addListener('onThemeChanged', (event) => {
			if (__DEV__) {
				console.log(`\x1b[34m[ACTION] \x1b[35m[onThemeChanged] \x1b[0m(${event.newValue})`);
			}

			Appearance.setColorScheme(event.newValue);
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onThemeChanged');
		};
	}, []);

	useEffect(() => {
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
			setSettingsValue('theme', theme);
		}
	}, [theme, colorScheme]);
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
			search_sources: ['inhouse', 'appstore', 'playstore', 'web', 'brandfetch', 'logo.dev']
		};

		const row = db.select().from(userTable).limit(1).get();

		hydrateSettings(row, defaults);

		setIsReady(true);
	}, [isReady]);

	useSyncSettings();

	return isReady;
};

export default useInitSettings;
