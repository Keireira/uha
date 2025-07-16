import { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';

import {
	SIGNS_BY_CODES,
	DEFAULT_SIGN,
	EUROPEAN_CURRENCIES,
	DEFAULT_CURRENCIES,
	ASIAN_CURRENCIES,
	MIDDLE_EAST_CURRENCIES,
	OCEANIAN_CURRENCIES
} from '@assets/currencies';

import type { ContextMenuAction } from 'react-native-context-menu-view';

const sortCurrenciesList = (currenciesList: ContextMenuAction[]) => {
	const sorted = [...currenciesList];

	sorted.sort((a: ContextMenuAction, b: ContextMenuAction) => {
		return (a.subtitle || a.title).localeCompare(b.subtitle || b.title);
	});

	return sorted;
};

const useGetCurrenciesList = (): ContextMenuAction[] => {
	const locales = useLocales();
	const { t } = useTranslation();

	const currenciesList = useMemo(() => {
		const forbiddenCodes: string[] = [];

		// DEFAULT CURRENCIES
		const currenciesActions: ContextMenuAction[] = DEFAULT_CURRENCIES.map((currency) => {
			forbiddenCodes.push(currency);

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

			forbiddenCodes.push(locales[0].currencyCode);
		}

		// EUROPEAN CURRENCIES
		const europeanCurrencies = EUROPEAN_CURRENCIES.reduce((acc, currency) => {
			if (forbiddenCodes.includes(currency)) {
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
			if (forbiddenCodes.includes(currency)) {
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
			if (forbiddenCodes.includes(currency)) {
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
			if (forbiddenCodes.includes(currency)) {
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

export default useGetCurrenciesList;
