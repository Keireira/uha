export const REGION_ORDER = [
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

export const REGION_MAP: Record<string, string[]> = {
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

export const RAW_LANGUAGES: { code: string; name: string }[] = [
	{ code: 'en', name: 'English' },
	{ code: 'ru', name: 'Русский' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'fr', name: 'Français' },
	{ code: 'es', name: 'Español' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'pt', name: 'Português' },
	{ code: 'nl', name: 'Nederlands' },
	{ code: 'pl', name: 'Polski' },
	{ code: 'cs', name: 'Čeština' },
	{ code: 'hu', name: 'Magyar' },
	{ code: 'ro', name: 'Română' },
	{ code: 'uk', name: 'Українська' },
	{ code: 'kk', name: 'Қазақша' },
	{ code: 'tr', name: 'Türkçe' },
	{ code: 'ar', name: 'العربية' },
	{ code: 'he', name: 'עברית' },
	{ code: 'ja', name: '日本語' },
	{ code: 'ko', name: '한국어' },
	{ code: 'zh', name: '中文' },
	{ code: 'th', name: 'ไทย' },
	{ code: 'vi', name: 'Tiếng Việt' },
	{ code: 'id', name: 'Bahasa Indonesia' },
	{ code: 'ms', name: 'Bahasa Melayu' },
	{ code: 'hi', name: 'हिन्दी' },
	{ code: 'sv', name: 'Svenska' },
	{ code: 'da', name: 'Dansk' },
	{ code: 'nb', name: 'Norsk' },
	{ code: 'fi', name: 'Suomi' }
];
