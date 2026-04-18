import { useMemo, useState } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { asc } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FREE_CURRENCY_BASE } from '@lib/entitlement';

import type { CurrencyItem, CurrencySection, RowItem } from '../select-currency.d';

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
	freeCurrencies: string[];
	setSearchQuery: (query: string) => void;
};

const useCurrencies = (): UseCurrenciesT => {
	const locales = useLocales();
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable).orderBy(asc(currenciesTable.region)), []);

	const freeCurrencies = useMemo(() => {
		const localeCurrency = locales[0]?.currencyCode;
		const primaryCodes =
			localeCurrency && !FREE_CURRENCY_BASE.includes(localeCurrency)
				? [...FREE_CURRENCY_BASE, localeCurrency]
				: FREE_CURRENCY_BASE;

		return primaryCodes;
	}, [locales]);

	/* Prebuild sections, so no excessive calculations for filtering */
	const rawSections = useMemo(() => {
		/* Primary (pre-defined) */
		const primaryItems: CurrencyItem[] = freeCurrencies.map((code) => {
			const name = t(`tokens.currencies.${code}`);

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
			const name = t(`tokens.currencies.${currency.id}`);

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
					title: t(`tokens.regions.${region}`),
					data: items
				});
			}
		}

		return sections;
	}, [freeCurrencies, currencies, t]);

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
		setSearchQuery,
		freeCurrencies
	};
};

export default useCurrencies;
