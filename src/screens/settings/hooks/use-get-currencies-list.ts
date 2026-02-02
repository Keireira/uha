import { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { asc } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { ContextMenuAction } from 'react-native-context-menu-view';

const sortCurrenciesList = (currenciesList: ContextMenuAction[]) => {
	const sorted = [...currenciesList];

	sorted.sort((a: ContextMenuAction, b: ContextMenuAction) => {
		return (a.subtitle || a.title).localeCompare(b.subtitle || b.title);
	});

	return sorted;
};

const DEFAULT_CURRENCIES = ['USD', 'EUR'];

const useGetCurrenciesList = (): ContextMenuAction[] => {
	const locales = useLocales();
	const { t } = useTranslation();
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable).orderBy(asc(currenciesTable.region)), []);

	const currenciesList = useMemo(() => {
		const defaultCodes: string[] = [];

		const currenciesIndex: Record<string, { title: string; actions: ContextMenuAction[] }> = {
			europe: {
				title: t('settings.currencies.europe'),
				actions: []
			},
			north_america: {
				title: t('settings.currencies.north_america'),
				actions: []
			},
			central_america: {
				title: t('settings.currencies.central_america'),
				actions: []
			},
			south_america: {
				title: t('settings.currencies.south_america'),
				actions: []
			},
			caribbean: {
				title: t('settings.currencies.caribbean'),
				actions: []
			},
			central_asia: {
				title: t('settings.currencies.central_asia'),
				actions: []
			},
			south_asia: {
				title: t('settings.currencies.south_asia'),
				actions: []
			},
			east_asia: {
				title: t('settings.currencies.east_asia'),
				actions: []
			},
			southeast_asia: {
				title: t('settings.currencies.southeast_asia'),
				actions: []
			},
			oceania: {
				title: t('settings.currencies.oceania'),
				actions: []
			},
			africa: {
				title: t('settings.currencies.africa'),
				actions: []
			},
			cryptocurrency: {
				title: t('settings.currencies.cryptocurrency'),
				actions: []
			},
			other: {
				title: t('settings.currencies.other'),
				actions: []
			}
		};

		/* Default currencies (usd, eur) */
		const currenciesActions: ContextMenuAction[] = DEFAULT_CURRENCIES.map((currency) => {
			defaultCodes.push(currency);

			return {
				title: t(`currencies.${currency}`),
				subtitle: currency
			};
		});

		/* Add locale's currency as default one */
		if (locales[0].currencyCode) {
			const localeCurrency = locales[0].currencyCode;

			if (!defaultCodes.includes(localeCurrency)) {
				currenciesActions.push({
					title: t(`currencies.${localeCurrency}`),
					subtitle: localeCurrency
				});

				defaultCodes.push(locales[0].currencyCode);
			}
		}

		/* Add any other currency */
		for (const currency of currencies) {
			const currencyAction: ContextMenuAction = {
				title: t(`currencies.${currency.id}`),
				subtitle: currency.id
			};

			currenciesIndex[currency.region] ??= {
				title: t(`settings.currencies.${currency.region}`),
				actions: []
			};

			currenciesIndex[currency.region].actions.push(currencyAction);
		}

		for (const region of Object.values(currenciesIndex)) {
			currenciesActions.push({
				title: region.title,
				actions: sortCurrenciesList(region.actions)
			});
		}

		return currenciesActions;
	}, [currencies, locales, t]);

	return currenciesList;
};

export default useGetCurrenciesList;
