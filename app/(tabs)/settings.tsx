import React, { useEffect, useState, useMemo } from 'react';

import { path } from 'ramda';
import i18n from '@src/i18n';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useLocales } from 'expo-localization';
import SettingsBridgeModule from '@modules/settings-bridge';

import { Wrapper, List } from '@ui';
import { Settings, useColorScheme } from 'react-native';
import { requestNotifications, checkNotifications, RESULTS } from 'react-native-permissions';

import {
	SIGNS_BY_CODES,
	DEFAULT_SIGN,
	EUROPEAN_CURRENCIES,
	DEFAULT_CURRENCIES,
	ASIAN_CURRENCIES,
	MIDDLE_EAST_CURRENCIES,
	OCEANIAN_CURRENCIES
} from '@assets/currencies';

import type { NativeSyntheticEvent } from 'react-native';
import type { Props as ListProps } from '@ui/list/list.d';
import type { PermissionStatus } from 'react-native-permissions';
import type { ContextMenuAction, ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';

const NOTIFICATION_STATUS_LABELS: Record<PermissionStatus, string> = {
	[RESULTS.UNAVAILABLE]: '',
	[RESULTS.DENIED]: 'Not requested',
	[RESULTS.BLOCKED]: 'Denied',
	[RESULTS.GRANTED]: 'All good',
	[RESULTS.LIMITED]: 'All good'
};

const SPACE_SIGN = ' ';

const getCurrencyPath = (indexPath: number[]): string[] => {
	const newPath = indexPath.join(`${SPACE_SIGN}actions${SPACE_SIGN}`).split(SPACE_SIGN);

	return [...newPath, 'subtitle'];
};

const sortCurrenciesList = (currenciesList: ContextMenuAction[]) => {
	const sorted = [...currenciesList];

	sorted.sort((a: ContextMenuAction, b: ContextMenuAction) => {
		return (a.subtitle || a.title).localeCompare(b.subtitle || b.title);
	});

	return sorted;
};

const useGetCurrenciesList = (): ContextMenuAction[] => {
	const { t } = useTranslation();
	const locales = useLocales();

	const currenciesList = useMemo(() => {
		// DEFAULT CURRENCIES
		const codesInDefaultUse: string[] = [];
		const currenciesActions: ContextMenuAction[] = DEFAULT_CURRENCIES.map((currency) => {
			codesInDefaultUse.push(currency);

			return {
				title: t(`currencies.${currency}`),
				subtitle: currency,
				systemIcon: SIGNS_BY_CODES[currency as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			};
		});

		if (locales[0].currencyCode) {
			currenciesActions.push({
				title: t(`currencies.${locales[0].currencyCode}`),
				subtitle: locales[0].currencyCode,
				systemIcon: SIGNS_BY_CODES[locales[0].currencyCode as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			});

			codesInDefaultUse.push(locales[0].currencyCode);
		}

		// EUROPEAN CURRENCIES
		const europeanCurrencies = EUROPEAN_CURRENCIES.reduce((acc, currency) => {
			if (codesInDefaultUse.includes(currency)) {
				return acc;
			}

			const nextAction = {
				title: t(`currencies.${currency}`),
				subtitle: currency,
				systemIcon: SIGNS_BY_CODES[currency as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			};

			return [...acc, nextAction];
		}, [] as ContextMenuAction[]);

		if (europeanCurrencies.length > 0) {
			const sortedEuropeanCurrencies = sortCurrenciesList(europeanCurrencies);

			currenciesActions.push({
				title: t('settings.currencies.european'),
				actions: sortedEuropeanCurrencies
			});
		}

		// ASIAN CURRENCIES
		const asianCurrencies = ASIAN_CURRENCIES.reduce((acc, currency) => {
			if (codesInDefaultUse.includes(currency)) {
				return acc;
			}

			const nextAction = {
				title: t(`currencies.${currency}`),
				subtitle: currency,
				systemIcon: SIGNS_BY_CODES[currency as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			};

			return [...acc, nextAction];
		}, [] as ContextMenuAction[]);

		if (asianCurrencies.length > 0) {
			const sortedAsianCurrencies = sortCurrenciesList(asianCurrencies);

			currenciesActions.push({
				title: t('settings.currencies.asian'),
				actions: sortedAsianCurrencies
			});
		}

		// MIDDLE EAST CURRENCIES
		const middleEastCurrencies = MIDDLE_EAST_CURRENCIES.reduce((acc, currency) => {
			if (codesInDefaultUse.includes(currency)) {
				return acc;
			}

			const nextAction = {
				title: t(`currencies.${currency}`),
				subtitle: currency,
				systemIcon: SIGNS_BY_CODES[currency as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			};

			return [...acc, nextAction];
		}, [] as ContextMenuAction[]);

		if (middleEastCurrencies.length > 0) {
			const sortedMiddleEastCurrencies = sortCurrenciesList(middleEastCurrencies);

			currenciesActions.push({
				title: t('settings.currencies.babah'),
				actions: sortedMiddleEastCurrencies
			});
		}

		// OCEANIAN CURRENCIES
		const oceanianCurrencies = OCEANIAN_CURRENCIES.reduce((acc, currency) => {
			if (codesInDefaultUse.includes(currency)) {
				return acc;
			}

			const nextAction = {
				title: t(`currencies.${currency}`),
				subtitle: currency,
				systemIcon: SIGNS_BY_CODES[currency as keyof typeof SIGNS_BY_CODES] || DEFAULT_SIGN
			};

			return [...acc, nextAction];
		}, [] as ContextMenuAction[]);

		if (oceanianCurrencies.length > 0) {
			const sortedOceanianCurrencies = sortCurrenciesList(oceanianCurrencies);

			currenciesActions.push({
				title: t('settings.currencies.maori'),
				actions: sortedOceanianCurrencies
			});
		}

		return currenciesActions;
	}, [t]);

	return currenciesList;
};

const useGetNotificationStatus = () => {
	const [notificationStatus, setNotificationStatus] = useState<PermissionStatus | null>(null);

	const check = () => {
		checkNotifications().then(({ status }) => {
			setNotificationStatus(status);
		});
	};

	useEffect(() => {
		check();

		SettingsBridgeModule.addListener('onNotificationChanged', (event) => {
			check();
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onNotificationChanged');
		};
	}, []);

	return {
		status: notificationStatus,
		label: NOTIFICATION_STATUS_LABELS[notificationStatus ?? RESULTS.UNAVAILABLE]
	};
};

const SettingsScreen = () => {
	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const currenciesList = useGetCurrenciesList();

	const notificationStatus = useGetNotificationStatus();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
	const [defaultCurrencyCode, setDefaultCurrencyCode] = useState(Settings.get('default_currency_code'));
	const [recalcCurrencyCode, setRecalcCurrencyCode] = useState(Settings.get('recalc_currency_code'));
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
			Linking.openSettings();
		}
	};

	const openSettings = () => {
		Linking.openSettings();
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
					title: t('settings.system.notifications'),
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
		}
	];

	return <Wrapper<ListProps> as={List} withBottom={false} sections={sections} />;
};

export default SettingsScreen;
