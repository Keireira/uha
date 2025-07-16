import React, { useEffect, useState } from 'react';

import { path } from 'ramda';
import i18n from '@src/i18n';
import { getCurrencyPath } from './utils';
import { openSettings } from 'expo-linking';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useGetCurrenciesList, useNotifications } from './hooks';

import { Wrapper, List } from '@ui';
import { AppLogoPicker } from '@elements';
import { Settings, useColorScheme, ScrollView } from 'react-native';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import type { NativeSyntheticEvent } from 'react-native';
import type { Props as ListProps } from '@ui/list/list.d';
import type { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';

const SettingsScreen = () => {
	const { t } = useTranslation();
	const handleScroll = useScrollDirection();

	const colorScheme = useColorScheme();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

	const currenciesList = useGetCurrenciesList();
	const notificationStatus = useNotifications();
	const [recalcCurrencyCode, setRecalcCurrencyCode] = useState(Settings.get('recalc_currency_code'));
	const [defaultCurrencyCode, setDefaultCurrencyCode] = useState(Settings.get('default_currency_code'));
	const [showFractions, setShowFractions] = useState(Settings.get('currency_fractions') === 1 ? true : false);

	useEffect(() => {
		setIsDarkMode(colorScheme === 'dark');
	}, [colorScheme]);

	const changeColorScheme = (isDarkMode: boolean) => {
		Settings.set({ theme: isDarkMode ? 'dark' : 'light' });
		setIsDarkMode(isDarkMode);
	};

	const changeCurrencyFractions = (isVisible: boolean) => {
		Settings.set({ currency_fractions: isVisible ? 1 : 0 });
		setShowFractions(isVisible);
	};

	const changePrimaryCurrency = ({ nativeEvent }: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
		const nextCurrencyCode = path(getCurrencyPath(nativeEvent.indexPath), currenciesList);

		Settings.set({ default_currency_code: nextCurrencyCode });
		setDefaultCurrencyCode(nextCurrencyCode);
	};

	const changeRecalcCurrency = ({ nativeEvent }: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
		const nextCurrencyCode = path(getCurrencyPath(nativeEvent.indexPath), currenciesList);

		Settings.set({ recalc_currency_code: nextCurrencyCode });
		setRecalcCurrencyCode(nextCurrencyCode);
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
					id: 'currency-fractions',
					title: t('settings.currencies.fractions'),
					accessory: {
						type: 'switch',
						value: showFractions,
						onPress: changeCurrencyFractions
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
						value: isDarkMode,
						onPress: changeColorScheme
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
