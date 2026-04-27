import { groupBy } from 'ramda';
import { useState } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';

import db from '@db';
import { asc } from 'drizzle-orm';
import { currenciesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { CurrencyItem, CurrencySection, RowItem } from '../select-currency.d';

import { FREE_CURRENCY_BASE } from '@lib/entitlement';

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

type UseCurrenciesT = {
	sections: RowItem[];
	freeCurrencies: string[];
	setSearchQuery: (query: string) => void;
};

type FlatItem = CurrencyItem & { sectionTitle: string };

const getText = (item: FlatItem) => [item.name, item.code];
const mapResultItem = ({ item }: { item: FlatItem }) => item;

const useCurrencies = (): UseCurrenciesT => {
	const [locale] = useLocales();
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: currencies } = useLiveQuery(db.select().from(currenciesTable).orderBy(asc(currenciesTable.region)), []);

	const localeCurrency = locale?.currencyCode;
	const freeCurrencies =
		localeCurrency && !FREE_CURRENCY_BASE.includes(localeCurrency)
			? [...FREE_CURRENCY_BASE, localeCurrency]
			: FREE_CURRENCY_BASE;

	const toItem = (code: string, region: string): CurrencyItem => ({
		id: code,
		key: `${region}-${code}`,
		code,
		name: t(`tokens.currencies.${code}`)
	});

	/* Primary section */
	const primaryItems = freeCurrencies.map((code) => ({
		...toItem(code, 'primary'),
		key: `primary-${code}`
	}));

	/* Group region currencies */
	const regionGroups = groupBy((currency) => currency.region, currencies);

	/* Assemble ordered sections */
	const rawSections: CurrencySection[] = [
		{
			title: t('settings.currencies.primary'),
			data: primaryItems
		}
	];

	for (const region of REGION_ORDER) {
		const group = regionGroups[region];

		if (!group?.length) continue;

		const items = group
			.map((currency) => toItem(currency.id, currency.region))
			.sort((a, b) => a.name.localeCompare(b.name));

		rawSections.push({
			title: t(`tokens.regions.${region}`),
			data: items
		});
	}

	/* Fuzzy search over flattened list */
	const flatItems: FlatItem[] = rawSections.flatMap((section) => {
		const items = section.data.map((item) => ({
			...item,
			sectionTitle: section.title
		}));

		return items;
	});

	const trimmed = searchQuery.trim();
	const matches = useFuzzySearchList({
		list: flatItems,
		queryText: trimmed,
		getText,
		mapResultItem
	});

	/* Regroup matches back into sections, preserving REGION_ORDER */
	const filteredSections: CurrencySection[] = trimmed
		? rawSections.reduce<CurrencySection[]>((acc, section) => {
				const data = matches.filter((m) => m.sectionTitle === section.title);

				if (data.length) {
					acc.push({ title: section.title, data });
				}

				return acc;
			}, [])
		: rawSections;

	/* Flatten into RowItem list */
	const sections: RowItem[] = [];

	for (const section of filteredSections) {
		sections.push({
			type: 'sectionHeader',
			title: section.title
		});

		for (let i = 0; i < section.data.length; i++) {
			sections.push({
				type: 'row',
				item: section.data[i],
				isLast: i === section.data.length - 1
			});
		}
	}

	return {
		sections,
		setSearchQuery,
		freeCurrencies
	};
};

export default useCurrencies;
