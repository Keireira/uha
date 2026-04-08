import { useState, useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

import i18n from '@src/i18n';
import { codeToFlag } from '@lib';
import { RAW_LANGUAGES, REGION_MAP, REGION_ORDER } from './data';
import { FREE_STORE_REGIONS_BASE, FREE_STORE_LANG_BASE } from '@lib/entitlement';

import type { SearchParamsT, OptionItem, OptionSection, RowItem } from '../select-store-option.d';

const normalize = (text: string) => text.toLocaleLowerCase().trim();

const buildCountryItem = (code: string, keyPrefix: string, t: (key: string) => string): OptionItem => {
	const name = t(`tokens.countries.${code}`);

	return {
		id: code,
		key: `${keyPrefix}-${code}`,
		search_key: `${normalize(name)}_${normalize(code)}`,
		code,
		name: `${codeToFlag(code)} ${name}`
	};
};

const buildLangItem = (lang: (typeof RAW_LANGUAGES)[number], keyPrefix: string): OptionItem => {
	const localized = i18n.t(`tokens.languages.${lang.code}`);

	return {
		id: lang.code,
		key: `${keyPrefix}-${lang.code}`,
		search_key: `${normalize(lang.name)}_${normalize(lang.code)}${localized ? `_${normalize(localized)}` : ''}`,
		code: lang.code,
		name: lang.name,
		subtitle: localized
	};
};

const buildCountrySections = (freeCodes: string[], t: (key: string) => string): OptionSection[] => {
	const primary: OptionSection = {
		title: t('settings.sources.primary'),
		data: freeCodes.map((code) => buildCountryItem(code, 'primary', t))
	};

	const regions: OptionSection[] = REGION_ORDER.map((region) => ({
		title: t(`tokens.regions.${region}`),
		data: REGION_MAP[region].map((code) => buildCountryItem(code, region, t))
	})).filter((s) => s.data.length > 0);

	return [primary, ...regions];
};

const buildLangSections = (t: (key: string) => string): OptionSection[] => {
	const freeSet = new Set(FREE_STORE_LANG_BASE);
	const langMap = new Map(RAW_LANGUAGES.map((l) => [l.code, l]));

	const primary = FREE_STORE_LANG_BASE.map((code) => langMap.get(code))
		.filter(Boolean)
		.map((lang) => buildLangItem(lang!, 'primary'));

	const other = RAW_LANGUAGES.filter((lang) => !freeSet.has(lang.code)).map((lang) => buildLangItem(lang, 'other'));

	return [
		{ title: t('settings.sources.primary'), data: primary },
		...(other.length > 0 ? [{ title: t('settings.sources.language'), data: other }] : [])
	];
};

const filterSections = (sections: OptionSection[], query: string): OptionSection[] => {
	if (!query) return sections;

	return sections.reduce<OptionSection[]>((acc, section) => {
		const data = section.data.filter((item) => item.search_key.includes(query));

		if (data.length > 0) acc.push({ ...section, data });

		return acc;
	}, []);
};

const flattenToRows = (sections: OptionSection[]): RowItem[] =>
	sections.flatMap((section) => [
		{ type: 'sectionHeader' as const, title: section.title },
		...section.data.map((item, i) => ({
			type: 'row' as const,
			item,
			isLast: i === section.data.length - 1
		}))
	]);

type UseStoreOptionsT = {
	sections: RowItem[];
	freeCodes: string[];
	isLangMode: boolean;
	setSearchQuery: (value: string) => void;
};

const useStoreOptions = (): UseStoreOptionsT => {
	const locales = useLocales();
	const { t } = useTranslation();
	const { target } = useLocalSearchParams<SearchParamsT>();
	const [searchQuery, setSearchQuery] = useState('');

	const isLangMode = target?.endsWith('_lang') ?? false;

	const freeCodes = useMemo(() => {
		const deviceRegion = locales[0]?.regionCode?.toUpperCase();

		if (deviceRegion && !FREE_STORE_REGIONS_BASE.includes(deviceRegion)) {
			return [...FREE_STORE_REGIONS_BASE, deviceRegion];
		}

		return FREE_STORE_REGIONS_BASE;
	}, [locales]);

	const rawSections = useMemo(
		() => (isLangMode ? buildLangSections(t) : buildCountrySections(freeCodes, t)),
		[isLangMode, freeCodes, t]
	);

	const sections = useMemo(
		() => flattenToRows(filterSections(rawSections, normalize(searchQuery))),
		[rawSections, searchQuery]
	);

	return {
		sections,
		freeCodes: isLangMode ? FREE_STORE_LANG_BASE : freeCodes,
		isLangMode,
		setSearchQuery
	};
};

export default useStoreOptions;
