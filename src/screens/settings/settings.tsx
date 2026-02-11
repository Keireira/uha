import React, { useState, useCallback } from 'react';

import { path } from 'ramda';
import i18n from '@src/i18n';
import { getCurrencyPath } from './utils';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useGetCurrenciesList, useNotifications } from './hooks';
import { useScrollDirection, setSettingsValue, useSettingsValue } from '@hooks';
import { backfillRates } from '@hooks/setup';
import Toast from 'react-native-toast-message';

import { Wrapper, List } from '@ui';
import { AppLogoPicker } from '@elements';
import { ScrollView } from 'react-native';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import type { NativeSyntheticEvent } from 'react-native';
import type { Props as ListProps } from '@ui/list/list.d';
import type { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';

const SettingsScreen = () => {
	const { t } = useTranslation();
	const handleScroll = useScrollDirection();

	const notificationStatus = useNotifications();

	const theme = useSettingsValue<'dark' | 'light'>('theme');

	const isOledEnabled = useSettingsValue<boolean>('oled_mode');
	const changeOledMode = (isEnabled: boolean) => {
		setSettingsValue('oled_mode', isEnabled);
	};

	const currenciesList = useGetCurrenciesList();
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const defaultCurrencyCode = useSettingsValue<string>('default_currency_code');

	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefreshRates = useCallback(async () => {
		setIsRefreshing(true);

		try {
			await backfillRates();

			Toast.show({
				type: 'success',
				text1: t('rates.success_title')
			});
		} catch {
			Toast.show({
				type: 'error',
				text1: t('rates.error_title'),
				text2: t('rates.error_description')
			});
		} finally {
			setIsRefreshing(false);
		}
	}, [t]);

	const changeColorScheme = (isDarkMode: boolean) => {
		setSettingsValue('theme', isDarkMode ? 'dark' : 'light');
	};

	const changePrimaryCurrency = ({ nativeEvent }: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
		const nextCurrencyCode = path(getCurrencyPath(nativeEvent.indexPath), currenciesList);

		setSettingsValue('default_currency_code', nextCurrencyCode);
	};

	const changeRecalcCurrency = ({ nativeEvent }: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
		const nextCurrencyCode = path(getCurrencyPath(nativeEvent.indexPath), currenciesList);

		setSettingsValue('recalc_currency_code', nextCurrencyCode);
	};

	const handleNotifications = () => {
		if (notificationStatus.status === RESULTS.DENIED) {
			requestNotifications();
		} else if (notificationStatus.status === RESULTS.BLOCKED) {
			openSettings();
		}
	};

	const sections: ListProps['sections'] = [
		{
			id: 'currency-section',
			title: t('settings.currencies.header'),
			innerArray: [
				{
					id: 'currency-main',
					title: t('settings.currencies.default'),
					accessory: {
						type: 'context-menu',
						trigger: t(`currencies.${defaultCurrencyCode}`),
						actions: currenciesList,
						onPress: changePrimaryCurrency
					}
				},
				{
					id: 'currency-recalc',
					title: t('settings.currencies.recalc'),
					accessory: {
						type: 'context-menu',
						trigger: t(`currencies.${recalcCurrencyCode}`),
						actions: currenciesList,
						onPress: changeRecalcCurrency
					}
				},
				{
					id: 'currency-refresh-rates',
					title: t('settings.currencies.refresh_rates'),
					accessory: {
						type: 'plain-action',
						trigger: isRefreshing ? '...' : t('settings.currencies.refresh_action'),
						onPress: handleRefreshRates
					}
				}
			]
		},
		{
			id: 'system-section',
			title: t('settings.system.header'),
			innerArray: [
				{
					id: 'system-notifications',
					title: t('settings.system.notifications.header'),
					accessory: {
						type: 'plain-action',
						trigger: notificationStatus.label,
						onPress: handleNotifications
					}
				},
				{
					id: 'system-language',
					title: t('settings.system.language'),
					accessory: {
						type: 'plain-action',
						trigger: t(`languages.${i18n.language}`),
						onPress: openSettings
					}
				},
				{
					id: 'system-dark-mode',
					title: t('settings.system.dark_mode'),
					accessory: {
						type: 'switch',
						value: theme === 'dark',
						onPress: changeColorScheme
					}
				},
				{
					id: 'system-oled-mode',
					title: t('settings.system.oled_mode'),
					accessory: {
						type: 'switch',
						disabled: theme !== 'dark',
						value: isOledEnabled,
						onPress: changeOledMode
					}
				}
			]
		},
		{
			id: 'about-section',
			title: t('settings.about.header'),
			innerArray: [
				{
					id: 'about-version',
					title: t('settings.about.version'),
					accessory: {
						type: 'text',
						text: `${nativeApplicationVersion} (${nativeBuildVersion})`
					}
				},
				{
					id: 'about-github',
					title: t('settings.about.sources'),
					accessory: {
						type: 'text',
						text: t('settings.about.github'),
						link: 'https://github.com/Keireira/uha'
					}
				},
				{
					id: 'about-testflight',
					title: t('settings.about.beta'),
					accessory: {
						type: 'text',
						text: t('settings.about.testflight'),
						link: 'https://testflight.apple.com/join/uVYrDkbA'
					}
				}
			]
		},
		{
			id: 'support-section',
			title: t('settings.donations.header'),
			bottomText: t('settings.donations.description'),
			innerArray: [
				{
					id: 'support-github',
					title: t('settings.about.github'),
					accessory: {
						type: 'text',
						text: 'keireira',
						link: 'https://github.com/sponsors/Keireira'
					}
				},
				{
					id: 'support-boosty',
					title: t('settings.donations.boosty'),
					accessory: {
						type: 'text',
						text: 'keireira',
						link: 'https://boosty.to/keireira/donate'
					}
				},
				{
					id: 'support-patreon',
					title: t('settings.donations.patreon'),
					accessory: {
						type: 'text',
						text: 'keireira_fog',
						link: 'https://patreon.com/keireira_fog'
					}
				}
			]
		}
	];

	return (
		<Wrapper as={ScrollView} onScroll={handleScroll}>
			<AppLogoPicker />

			<List sections={sections} />
		</Wrapper>
	);
};

export default SettingsScreen;
