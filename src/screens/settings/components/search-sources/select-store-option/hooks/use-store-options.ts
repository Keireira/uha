import { useMemo, useState } from 'react';
import { useLocales } from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

import i18n from '@src/i18n';
import { RAW_LANGUAGES, codeToFlag } from '../../data';
import { FREE_STORE_REGIONS_BASE, FREE_STORE_LANG_BASE } from '@lib/entitlement';

import type { SearchParamsT, OptionItem, OptionSection, RowItem } from '../select-store-option.d';

const format = (text: string) => text.toLocaleLowerCase().trim();

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
	'other'
];

const REGION_MAP: Record<string, string[]> = {
	europe: [
		'AL', // Albania
		'AD', // Andorra
		'AT', // Austria
		'BY', // Belarus
		'BE', // Belgium
		'BA', // Bosnia and Herzegovina
		'BG', // Bulgaria
		'HR', // Croatia
		'CY', // Cyprus
		'CZ', // Czechia
		'DK', // Denmark
		'EE', // Estonia
		'FI', // Finland
		'FR', // France
		'GE', // Georgia
		'DE', // Germany
		'GR', // Greece
		'HU', // Hungary
		'IS', // Iceland
		'IE', // Ireland
		'IL', // Israel
		'IT', // Italy
		'LV', // Latvia
		'LI', // Liechtenstein
		'LT', // Lithuania
		'LU', // Luxembourg
		'MT', // Malta
		'MD', // Moldova
		'MC', // Monaco
		'ME', // Montenegro
		'NL', // Netherlands
		'MK', // North Macedonia
		'NO', // Norway
		'PL', // Poland
		'PT', // Portugal
		'RO', // Romania
		'RU', // Russia
		'RS', // Serbia
		'SK', // Slovakia
		'SI', // Slovenia
		'ES', // Spain
		'SE', // Sweden
		'CH', // Switzerland
		'UA', // Ukraine
		'GB' // United Kingdom
	],
	north_america: [
		'US', // United States
		'CA', // Canada
		'MX' // Mexico
	],
	central_america: [
		'BZ', // Belize
		'CR', // Costa Rica
		'SV', // El Salvador
		'GT', // Guatemala
		'HN', // Honduras
		'NI', // Nicaragua
		'PA' // Panama
	],
	south_america: [
		'AR', // Argentina
		'BO', // Bolivia
		'BR', // Brazil
		'CL', // Chile
		'CO', // Colombia
		'EC', // Ecuador
		'GY', // Guyana
		'PY', // Paraguay
		'PE', // Peru
		'SR', // Suriname
		'UY', // Uruguay
		'VE' // Venezuela
	],
	caribbean: [
		'AG', // Antigua and Barbuda
		'AI', // Anguilla
		'BB', // Barbados
		'BM', // Bermuda
		'BS', // Bahamas
		'DM', // Dominica
		'DO', // Dominican Republic
		'GD', // Grenada
		'JM', // Jamaica
		'KN', // Saint Kitts and Nevis
		'KY', // Cayman Islands
		'LC', // Saint Lucia
		'MS', // Montserrat
		'TC', // Turks and Caicos
		'TT', // Trinidad and Tobago
		'VC', // Saint Vincent and the Grenadines
		'VG' // British Virgin Islands
	],
	central_asia: [
		'AZ', // Azerbaijan
		'AM', // Armenia
		'KZ', // Kazakhstan
		'KG', // Kyrgyzstan
		'MN', // Mongolia
		'TJ', // Tajikistan
		'TM', // Turkmenistan
		'UZ' // Uzbekistan
	],
	south_asia: [
		'AF', // Afghanistan
		'BD', // Bangladesh
		'BT', // Bhutan
		'IN', // India
		'MV', // Maldives
		'NP', // Nepal
		'PK', // Pakistan
		'LK' // Sri Lanka
	],
	east_asia: [
		'CN', // China
		'HK', // Hong Kong
		'JP', // Japan
		'MO', // Macau
		'KR', // Korea
		'TW' // Taiwan
	],
	southeast_asia: [
		'BN', // Brunei
		'KH', // Cambodia
		'ID', // Indonesia
		'LA', // Laos
		'MY', // Malaysia
		'MM', // Myanmar
		'PH', // Philippines
		'SG', // Singapore
		'TH', // Thailand
		'VN' // Vietnam
	],
	oceania: [
		'AU', // Australia
		'FJ', // Fiji
		'FM', // Micronesia
		'NR', // Nauru
		'NZ', // New Zealand
		'PW', // Palau
		'PG', // Papua New Guinea
		'SB', // Solomon Islands
		'TO', // Tonga
		'VU', // Vanuatu
		'WS' // Samoa
	],
	africa: [
		'AO', // Angola
		'BJ', // Benin
		'BW', // Botswana
		'BF', // Burkina Faso
		'CM', // Cameroon
		'CV', // Cape Verde
		'CF', // Central African Republic
		'TD', // Chad
		'CD', // Congo (DRC)
		'CG', // Congo (Republic)
		'CI', // Côte d'Ivoire
		'ET', // Ethiopia
		'GA', // Gabon
		'GM', // Gambia
		'GH', // Ghana
		'GN', // Guinea
		'GW', // Guinea-Bissau
		'KE', // Kenya
		'LR', // Liberia
		'MG', // Madagascar
		'MW', // Malawi
		'ML', // Mali
		'MR', // Mauritania
		'MU', // Mauritius
		'MZ', // Mozambique
		'NA', // Namibia
		'NE', // Niger
		'NG', // Nigeria
		'RW', // Rwanda
		'ST', // São Tomé and Príncipe
		'SN', // Senegal
		'SC', // Seychelles
		'SL', // Sierra Leone
		'ZA', // South Africa
		'SZ', // Eswatini
		'TZ', // Tanzania
		'UG', // Uganda
		'ZM', // Zambia
		'ZW' // Zimbabwe
	],
	other: [
		'AE', // United Arab Emirates
		'BH', // Bahrain
		'DZ', // Algeria
		'EG', // Egypt
		'IQ', // Iraq
		'JO', // Jordan
		'KW', // Kuwait
		'LB', // Lebanon
		'LY', // Libya
		'MA', // Morocco
		'OM', // Oman
		'QA', // Qatar
		'SA', // Saudi Arabia
		'TN', // Tunisia
		'TR', // Turkey
		'YE' // Yemen
	]
};

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

	const makeCountryItem = (code: string, keyPrefix: string): OptionItem | null => {
		const countryName = t(`tokens.countries.${code}`);

		return {
			id: code,
			key: `${keyPrefix}-${code}`,
			search_key: `${format(countryName)}_${format(code)}`,
			code,
			name: `${codeToFlag(code)} ${countryName}`
		};
	};

	const rawSections = useMemo(() => {
		if (!isLangMode) {
			const primaryItems: OptionItem[] = [];

			for (const code of freeCodes) {
				const item = makeCountryItem(code, 'primary');

				if (item) {
					primaryItems.push(item);
				}
			}

			const sections: OptionSection[] = [{ title: t('settings.sources.primary'), data: primaryItems }];

			for (const region of REGION_ORDER) {
				const codes = REGION_MAP[region];
				const items: OptionItem[] = [];

				for (const code of codes) {
					const item = makeCountryItem(code, region);

					if (item) {
						items.push(item);
					}
				}

				if (items.length > 0) {
					sections.push({
						title: t(`tokens.regions.${region}`),
						data: items
					});
				}
			}

			return sections;
		}

		const makeLangItem = (l: (typeof RAW_LANGUAGES)[number], keyPrefix: string): OptionItem => {
			const localized = i18n.exists(`tokens.languages.${l.code}`) ? i18n.t(`tokens.languages.${l.code}`) : undefined;

			return {
				id: l.code,
				key: `${keyPrefix}-${l.code}`,
				search_key: `${format(l.name)}_${format(l.code)}${localized ? `_${format(localized)}` : ''}`,
				code: l.code,
				name: l.name,
				subtitle: localized
			};
		};

		const langMap = new Map(RAW_LANGUAGES.map((l) => [l.code, l]));

		const primaryLangs: OptionItem[] = [];
		for (const code of FREE_STORE_LANG_BASE) {
			const lang = langMap.get(code);
			if (lang) primaryLangs.push(makeLangItem(lang, 'primary'));
		}

		const otherLangs: OptionItem[] = [];
		for (const lang of RAW_LANGUAGES) {
			if (!FREE_STORE_LANG_BASE.includes(lang.code)) {
				otherLangs.push(makeLangItem(lang, 'other'));
			}
		}

		const langSections: OptionSection[] = [{ title: t('settings.sources.primary'), data: primaryLangs }];

		if (otherLangs.length > 0) {
			langSections.push({ title: t('settings.sources.language'), data: otherLangs });
		}

		return langSections;
	}, [isLangMode, freeCodes, t]);

	const filteredSections = useMemo(() => {
		const query = format(searchQuery);
		if (!query) return rawSections;

		const filtered: OptionSection[] = [];

		for (const section of rawSections) {
			const data = section.data.filter((item) => item.search_key.includes(query));

			if (data.length) {
				filtered.push({ title: section.title, data });
			}
		}

		return filtered;
	}, [searchQuery, rawSections]);

	const sections = useMemo(() => {
		const items: RowItem[] = [];

		for (const section of filteredSections) {
			items.push({ type: 'sectionHeader', title: section.title });

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

	const activeFree = isLangMode ? FREE_STORE_LANG_BASE : freeCodes;

	return { sections, freeCodes: activeFree, isLangMode, setSearchQuery };
};

export default useStoreOptions;
