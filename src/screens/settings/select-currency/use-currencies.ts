import { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { asc } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export type CurrencyItem = {
	id: string;
	name: string;
	code: string;
	key: string;
};

export type CurrencySection = {
	title: string;
	data: CurrencyItem[];
};

const DEFAULT_CURRENCIES = ['USD', 'EUR'];

const REGION_ORDER = [
	'europe',
	'north_america',
	'central_america',
	'south_america',
	'caribbean',
	'central_asia',
	'south_asia',
	'east_asia',
	'southeast_asia',
	'oceania',
	'africa',
	'cryptocurrency',
	'other'
] as const;

const useCurrencies = (searchQuery: string): CurrencySection[] => {
	const locales = useLocales();
	const { t } = useTranslation();
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable).orderBy(asc(currenciesTable.region)), []);

	const sections = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		// Build primary section
		const primaryCodes = [...DEFAULT_CURRENCIES];
		const localeCurrency = locales[0]?.currencyCode;

		if (localeCurrency && !primaryCodes.includes(localeCurrency)) {
			primaryCodes.push(localeCurrency);
		}

		const primaryItems: CurrencyItem[] = primaryCodes.map((code) => ({
			id: code,
			name: t(`currencies.${code}`),
			code,
			key: `primary-${code}`
		}));

		// Build region sections
		const regionMap: Record<string, CurrencyItem[]> = {};

		for (const currency of currencies) {
			const item: CurrencyItem = {
				id: currency.id,
				name: t(`currencies.${currency.id}`),
				code: currency.id,
				key: `${currency.region}-${currency.id}`
			};

			regionMap[currency.region] ??= [];
			regionMap[currency.region].push(item);
		}

		// Sort items within each region
		for (const items of Object.values(regionMap)) {
			items.sort((a, b) => a.name.localeCompare(b.name));
		}

		// Build ordered sections
		const result: CurrencySection[] = [];

		// Primary section first
		const filteredPrimary = query
			? primaryItems.filter(
					(item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)
				)
			: primaryItems;

		if (filteredPrimary.length > 0) {
			result.push({
				title: t('settings.currencies.primary'),
				data: filteredPrimary
			});
		}

		// Region sections
		for (const region of REGION_ORDER) {
			const items = regionMap[region];
			if (!items?.length) continue;

			const filteredItems = query
				? items.filter((item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query))
				: items;

			if (filteredItems.length > 0) {
				result.push({
					title: t(`settings.currencies.${region}`),
					data: filteredItems
				});
			}
		}

		return result;
	}, [currencies, locales, t, searchQuery]);

	return sections;
};

export default useCurrencies;
