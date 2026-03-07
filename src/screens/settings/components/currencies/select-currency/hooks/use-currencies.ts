import { useMemo, useState } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { asc } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { CurrencyItem, CurrencySection, RowItem } from '../select-currency.d';

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
];

const format = (text: string) => text.toLocaleLowerCase().trim();

type UseCurrenciesT = {
	sections: RowItem[];
	searchQuery: string;
	setSearchQuery: (query: string) => void;
};

const useCurrencies = (): UseCurrenciesT => {
	const locales = useLocales();
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable).orderBy(asc(currenciesTable.region)), []);

	/* Prebuild sections, so no excessive calculations for filtering */
	const rawSections = useMemo(() => {
		/* Primary (pre-defined) */
		const localeCurrency = locales[0]?.currencyCode;
		const primaryCodes =
			localeCurrency && !DEFAULT_CURRENCIES.includes(localeCurrency)
				? [...DEFAULT_CURRENCIES, localeCurrency]
				: DEFAULT_CURRENCIES;

		const primaryItems: CurrencyItem[] = primaryCodes.map((code) => {
			const name = t(`currencies.${code}`);

			return {
				id: code,
				key: `primary-${code}`,
				search_key: `${format(name)}_${format(code)}`,
				code,
				name
			};
		});

		/* Regions */
		const regionMap = new Map<string, CurrencyItem[]>();

		for (const currency of currencies) {
			const name = t(`currencies.${currency.id}`);

			const item: CurrencyItem = {
				id: currency.id,
				key: `${currency.region}-${currency.id}`,
				search_key: `${format(name)}_${format(currency.id)}`,
				code: currency.id,
				name
			};

			const list = regionMap.get(currency.region);

			if (list) {
				list.push(item);
			} else {
				regionMap.set(currency.region, [item]);
			}
		}

		/* Sort */
		for (const items of regionMap.values()) {
			items.sort((a, b) => a.name.localeCompare(b.name));
		}

		const sections: { title: string; data: CurrencyItem[] }[] = [
			{ title: t('settings.currencies.primary'), data: primaryItems }
		];

		for (const region of REGION_ORDER) {
			const items = regionMap.get(region);

			if (items?.length) {
				sections.push({
					title: t(`settings.currencies.${region}`),
					data: items
				});
			}
		}

		return sections;
	}, [currencies, locales, t]);

	/* Filter sections */
	const filteredSections = useMemo(() => {
		const query = format(searchQuery);

		if (!query) {
			return rawSections;
		}

		const filtered: CurrencySection[] = [];

		for (const section of rawSections) {
			const data = section.data.filter((item) => item.search_key.includes(query));

			if (data.length) {
				filtered.push({
					title: section.title,
					data
				});
			}
		}

		return filtered;
	}, [searchQuery, rawSections]);

	/* Sections to render */
	const sections = useMemo(() => {
		const items: RowItem[] = [];

		for (const section of filteredSections) {
			items.push({
				type: 'sectionHeader',
				title: section.title
			});

			for (let i = 0; i < section.data.length; i++) {
				items.push({
					type: 'row',
					item: section.data[i],
					isLast: i === section.data.length - 1
				});
			}
		}

		return items;
	}, [filteredSections]);

	return {
		sections,
		searchQuery,
		setSearchQuery
	};
};

export default useCurrencies;
