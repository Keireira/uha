import type { LocaleRootT, RegionsT, CurrencyCode, LanguageCode, CountriesList } from './locales.d';

// Tokens
const regions: RegionsT = {
	europe: 'Europe',
	north_america: 'North America',
	central_america: 'Central America',
	south_america: 'South America',
	caribbean: 'Caribbean',
	central_asia: 'Central Asia',
	south_asia: 'South Asia',
	east_asia: 'East Asia',
	southeast_asia: 'Southeast Asia',
	oceania: 'Oceania',
	africa: 'Africa',
	other: 'Other',
	cryptocurrency: 'Cryptocurrencies'
};
const countries: Record<CountriesList, string> = {
	AF: 'Afghanistan',
	AL: 'Albania',
	DZ: 'Algeria',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguilla',
	AG: 'Antigua and Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaijan',
	BS: 'Bahamas',
	BH: 'Bahrain',
	BD: 'Bangladesh',
	BB: 'Barbados',
	BY: 'Belarus',
	BE: 'Belgium',
	BZ: 'Belize',
	BJ: 'Benin',
	BM: 'Bermuda',
	BT: 'Bhutan',
	BO: 'Bolivia',
	BA: 'Bosnia and Herzegovina',
	BW: 'Botswana',
	BR: 'Brazil',
	BN: 'Brunei',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	CV: 'Cabo Verde',
	KH: 'Cambodia',
	CM: 'Cameroon',
	CA: 'Canada',
	KY: 'Cayman Islands',
	CF: 'Central African Republic',
	TD: 'Chad',
	CL: 'Chile',
	CN: 'China',
	CO: 'Colombia',
	CD: 'Congo (DR)',
	CG: 'Congo',
	CR: 'Costa Rica',
	HR: 'Croatia',
	CY: 'Cyprus',
	CZ: 'Czechia',
	CI: "Côte d'Ivoire",
	DK: 'Denmark',
	DM: 'Dominica',
	DO: 'Dominican Republic',
	EC: 'Ecuador',
	EG: 'Egypt',
	SV: 'El Salvador',
	EE: 'Estonia',
	SZ: 'Eswatini',
	ET: 'Ethiopia',
	FJ: 'Fiji',
	FI: 'Finland',
	FR: 'France',
	GA: 'Gabon',
	GM: 'Gambia',
	GE: 'Georgia',
	DE: 'Germany',
	GH: 'Ghana',
	GR: 'Greece',
	GD: 'Grenada',
	GT: 'Guatemala',
	GN: 'Guinea',
	GW: 'Guinea-Bissau',
	GY: 'Guyana',
	HN: 'Honduras',
	HK: 'Hong Kong',
	HU: 'Hungary',
	IS: 'Iceland',
	IN: 'India',
	ID: 'Indonesia',
	IQ: 'Iraq',
	IE: 'Ireland',
	IL: 'Israel',
	IT: 'Italy',
	JM: 'Jamaica',
	JP: 'Japan',
	JO: 'Jordan',
	KZ: 'Kazakhstan',
	KE: 'Kenya',
	KR: 'Korea',
	KW: 'Kuwait',
	KG: 'Kyrgyzstan',
	LA: 'Laos',
	LV: 'Latvia',
	LB: 'Lebanon',
	LR: 'Liberia',
	LY: 'Libya',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MO: 'Macao',
	MG: 'Madagascar',
	MW: 'Malawi',
	MY: 'Malaysia',
	MV: 'Maldives',
	ML: 'Mali',
	MT: 'Malta',
	MR: 'Mauritania',
	MU: 'Mauritius',
	MX: 'Mexico',
	FM: 'Micronesia',
	MD: 'Moldova',
	MC: 'Monaco',
	MN: 'Mongolia',
	ME: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Morocco',
	MZ: 'Mozambique',
	MM: 'Myanmar',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Netherlands',
	NZ: 'New Zealand',
	NI: 'Nicaragua',
	NE: 'Niger',
	NG: 'Nigeria',
	MK: 'North Macedonia',
	NO: 'Norway',
	OM: 'Oman',
	PK: 'Pakistan',
	PW: 'Palau',
	PA: 'Panama',
	PG: 'Papua New Guinea',
	PY: 'Paraguay',
	PE: 'Peru',
	PH: 'Philippines',
	PL: 'Poland',
	PT: 'Portugal',
	PS: 'Palestine',
	QA: 'Qatar',
	RO: 'Romania',
	RU: 'Russia',
	RW: 'Rwanda',
	KN: 'Saint Kitts and Nevis',
	LC: 'Saint Lucia',
	VC: 'Saint Vincent and the Grenadines',
	WS: 'Samoa',
	ST: 'São Tomé and Príncipe',
	SA: 'Saudi Arabia',
	SN: 'Senegal',
	RS: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leone',
	SG: 'Singapore',
	SK: 'Slovakia',
	SI: 'Slovenia',
	SB: 'Solomon Islands',
	ZA: 'South Africa',
	ES: 'Spain',
	LK: 'Sri Lanka',
	SR: 'Suriname',
	SE: 'Sweden',
	CH: 'Switzerland',
	TW: 'Taiwan',
	TJ: 'Tajikistan',
	TZ: 'Tanzania',
	TH: 'Thailand',
	TO: 'Tonga',
	TT: 'Trinidad and Tobago',
	TN: 'Tunisia',
	TR: 'Turkey',
	TM: 'Turkmenistan',
	TC: 'Turks and Caicos Islands',
	UG: 'Uganda',
	UA: 'Ukraine',
	AE: 'United Arab Emirates',
	GB: 'United Kingdom',
	US: 'United States',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VU: 'Vanuatu',
	VE: 'Venezuela',
	VN: 'Vietnam',
	VG: 'British Virgin Islands',
	XK: 'Kosovo',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabwe'
};
const languages: Record<LanguageCode, string> = {
	en: 'English',
	ru: 'Russian',
	kk: 'Kazakh',
	es: 'Spanish',
	ja: 'Japanese',
	de: 'German',
	fr: 'French',
	it: 'Italian',
	pt: 'Portuguese',
	nl: 'Dutch',
	pl: 'Polish',
	cs: 'Czech',
	hu: 'Hungarian',
	ro: 'Romanian',
	uk: 'Ukrainian',
	tr: 'Turkish',
	ar: 'Arabic',
	he: 'Hebrew',
	ko: 'Korean',
	zh: 'Chinese',
	th: 'Thai',
	vi: 'Vietnamese',
	id: 'Indonesian',
	ms: 'Malay',
	hi: 'Hindi',
	sv: 'Swedish',
	da: 'Danish',
	nb: 'Norwegian',
	fi: 'Finnish'
};
const currencies: Record<CurrencyCode, string> = {
	AOA: 'Angolan Kwanza',
	BWP: 'Botswanan Pula',
	BIF: 'Burundian Franc',
	CDF: 'Congolese Franc',
	CVE: 'Cape Verdean Escudo',
	ETB: 'Ethiopian Birr',
	GHS: 'Ghanaian Cedi',
	KES: 'Kenyan Shilling',
	LRD: 'Liberian Dollar',
	LSL: 'Lesotho Loti',
	MUR: 'Mauritian Rupee',
	MWK: 'Malawian Kwacha',
	MZN: 'Mozambican Metical',
	NAD: 'Namibian Dollar',
	NGN: 'Nigerian Naira',
	RWF: 'Rwandan Franc',
	SCR: 'Seychellois Rupee',
	SZL: 'Swazi Lilangeni',
	TZS: 'Tanzanian Shilling',
	UGX: 'Ugandan Shilling',
	XAF: 'Central African CFA Franc',
	XOF: 'West African CFA Franc',
	ZAR: 'South African Rand',
	ZMW: 'Zambian Kwacha',
	ALL: 'Albanian Lek',
	BAM: 'Bosnia-Herzegovina Convertible Mark',
	BGN: 'Bulgarian Lev',
	CHF: 'Swiss Franc',
	CZK: 'Czech Koruna',
	DKK: 'Danish Krone',
	EUR: 'Euro',
	GBP: 'British Pound',
	GEL: 'Georgian Lari',
	GIP: 'Gibraltar Pound',
	HUF: 'Hungarian Forint',
	ILS: 'Israeli Shekel',
	ISK: 'Icelandic Króna',
	MDL: 'Moldovan Leu',
	MKD: 'Macedonian Denar',
	NOK: 'Norwegian Krone',
	PLN: 'Polish Zloty',
	RON: 'Romanian Leu',
	RSD: 'Serbian Dinar',
	RUB: 'Russian Ruble',
	SEK: 'Swedish Krona',
	TRY: 'Turkish Lira',
	UAH: 'Ukrainian Hryvnia',
	CAD: 'Canadian Dollar',
	MXN: 'Mexican Peso',
	USD: 'US Dollar',
	BZD: 'Belize Dollar',
	CRC: 'Costa Rican Colón',
	GTQ: 'Guatemalan Quetzal',
	HNL: 'Honduran Lempira',
	NIO: 'Nicaraguan Córdoba',
	PAB: 'Panamanian Balboa',
	SVC: 'Salvadoran Colón',
	ARS: 'Argentine Peso',
	BOB: 'Bolivian Boliviano',
	BRL: 'Brazilian Real',
	CLP: 'Chilean Peso',
	COP: 'Colombian Peso',
	GYD: 'Guyanaese Dollar',
	PEN: 'Peruvian Sol',
	PYG: 'Paraguayan Guarani',
	SRD: 'Surinamese Dollar',
	UYU: 'Uruguayan Peso',
	AWG: 'Aruban Florin',
	BBD: 'Barbadian Dollar',
	BMD: 'Bermudan Dollar',
	BSD: 'Bahamian Dollar',
	CUP: 'Cuban Peso',
	DOP: 'Dominican Peso',
	HTG: 'Haitian Gourde',
	JMD: 'Jamaican Dollar',
	KYD: 'Cayman Islands Dollar',
	TTD: 'Trinidad & Tobago Dollar',
	XCD: 'East Caribbean Dollar',
	AMD: 'Armenian Dram',
	AZN: 'Azerbaijani Manat',
	KGS: 'Kyrgystani Som',
	KZT: 'Tenge',
	TJS: 'Tajikistani Somoni',
	UZS: 'Uzbekistani Som',
	INR: 'Indian Rupee',
	LKR: 'Sri Lankan Rupee',
	NPR: 'Nepalese Rupee',
	CNH: 'Chinese Yuan (Offshore)',
	CNY: 'Chinese Yuan',
	HKD: 'Hong Kong Dollar',
	JPY: 'Japanese Yen',
	KRW: 'Korean Won',
	MOP: 'Macanese Pataca',
	TWD: 'New Taiwan Dollar',
	KHR: 'Cambodian Riel',
	LAK: 'Laotian Kip',
	MMK: 'Myanmar Kyat',
	PHP: 'Philippine Peso',
	SGD: 'Singapore Dollar',
	THB: 'Thai Baht',
	VND: 'Vietnamese Dong',
	AUD: 'Australian Dollar',
	FJD: 'Fijian Dollar',
	NZD: 'New Zealand Dollar',
	PGK: 'Papua New Guinean Kina',
	SBD: 'Solomon Islands Dollar',
	TOP: 'Tongan Paʻanga',
	BCH: 'Bitcoin Cash',
	BTC: 'Bitcoin',
	BTG: 'Bitcoin Gold',
	DASH: 'Dash',
	EOS: 'EOS',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	XLM: 'Stellar Lumens',
	XRP: 'Ripple',
	AED: 'UAE Dirham',
	OMR: 'Omani Rial',
	BDT: 'Bangladeshi Taka',
	IDR: 'Indonesian Rupiah',
	MYR: 'Malaysian Ringgit',
	EGP: 'Egyptian Pound',
	MVR: 'Maldivian Rufiyaa'
};

// Screens
const settingsScreen: LocaleRootT['settings'] = {
	system: {
		notifications: {
			header: 'Notifications',
			results: {
				denied: 'Not requested',
				blocked: 'Disabled',
				granted: 'Enabled',
				limited: 'Enabled'
			}
		},
		language: 'Language'
	},
	appearance: {
		header: 'Appearance',
		light: 'Light',
		dark: 'Dark',
		oled: 'OLED'
	},
	preferences: {
		header: 'Preferences',
		first_day: 'First Day of Week',
		max_horizon: 'Max Horizon',
		years_unit: 'yr',
		day_hint_us: 'US style',
		day_hint_iso: 'International'
	},
	general: {
		header: 'System'
	},
	currencies: {
		header: 'Currencies',
		default_currency: 'Default Currency',
		recalc_currency: 'Recalc Currency',
		refresh_rates: 'Exchange Rates',
		search: 'Search currencies',
		primary: 'Primary'
	},
	sources: {
		header: 'Search Sources',
		footer: 'Inhouse results are always shown regardless of these settings.',
		search: 'Search',
		primary: 'Primary',
		language: 'Language',
		appstore: 'App Store',
		playstore: 'Google Play',
		web: 'Web',
		brandfetch: 'Brandfetch',
		logo_dev: 'logo.dev'
	},
	about: {
		bug: 'Report a bug',
		website: 'uha.app',
		sources: 'Sources',
		beta: 'Join Beta',
		version: 'Version'
	},
	donations: {
		header: 'Support Me',
		description: 'Uha is built by a solo indie developer. Your support helps keep it alive and improving.',

		// unit.type
		patreon: 'Patreon',
		github: 'GitHub',
		boosty: 'Boosty',
		ko_fi: 'Ko-fi'
	},
	unlimited: {
		badge: 'Unlimited',
		active: 'All features unlocked',
		upgrade: 'Unlock all features'
	},
	data: {
		header: 'Data',
		cancel: 'Cancel',
		data_footer: 'Restoring any backup will overwrite all existing data.',

		db: {
			backup: {
				title: 'Backup',
				success: 'Backup created',
				error: 'Backup failed'
			},
			restore: {
				title: 'Restore',
				success: 'Data restored successfully',
				error: 'Failed to restore data'
			}
		},

		csv: {
			export: {
				title: 'Export to CSV',
				success: 'Export ready',
				error: 'Export failed'
			},
			import: {
				title: 'Restore from CSV',
				success: 'Data imported successfully',
				error: 'Failed to import data'
			}
		},

		icloud: {
			sync: 'iCloud Sync',

			statuses: {
				checking: 'Checking...',
				unavailable: 'Sign in to iCloud',
				backing_up: 'Backing up...',
				restoring: 'Restoring...',
				no_backup: 'No backup yet'
			},

			backup: {
				title: 'Backup to iCloud',
				success: 'Backed up to iCloud',
				error: 'iCloud backup failed'
			},

			restore: {
				title: 'Restore from iCloud',
				success: 'Restored from iCloud',
				error: 'iCloud restore failed'
			}
		}
	},
	ai: {
		header: 'AI Features',
		footer: 'Form suggestions are free. Other AI features require Unlimited.',
		status: 'Device Status',
		toggle: 'On-device AI',
		supported: 'Available',
		not_supported: 'Not available'
	},
	tip_jar: {
		header: 'Tip Jar',
		thanks: 'Thank you for your support!',
		error: 'Unknown error occurred while processing your tip.',

		products: {
			small_fry: 'Small Fry',
			good_catch: 'Good Catch',
			big_fish: 'Big Fish',
			whale: 'Whale'
		}
	}
};
const libraryScreen: LocaleRootT['library'] = {
	title: 'Library',
	grid: {
		categories: {
			title: 'Categories',
			description: 'Browse and edit category groups'
		},
		services: {
			title: 'Services',
			description: 'Browse and edit providers'
		},
		payments: {
			title: 'Payment methods',
			description: 'Browse and edit cards or wallets'
		},
		subscriptions: {
			title: 'Subscriptions',
			description: 'Browse and edit active plans'
		}
	},
	delete_blocked: {
		title: "Can't delete",
		default_category: 'This is system category',
		category_one: 'Used by 1 subscription',
		category_other: 'Used by {{count}} subscriptions',
		service_one: 'Used by 1 subscription',
		service_other: 'Used by {{count}} subscriptions',
		payment_one: 'Used by 1 subscription',
		payment_other: 'Used by {{count}} subscriptions'
	},
	details: {
		save: 'Save',
		id_copied: 'ID copied',
		section: {
			identity: 'Identity',
			appearance: 'Appearance',
			other: 'Other'
		},
		fields: {
			slug: 'Slug',
			id: 'ID',
			title: 'Custom Title',
			emoji: 'Emoji',
			color: 'Color',
			comment: 'Comment',
			card: 'Card',
			category: 'Category',
			symbol: 'SF Symbol',
			logo_url: 'Logo URL',
			bundle_id: 'Bundle ID',
			ref_link: 'Referral link'
		}
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Total',
		no_txs: 'No transactions'
	},
	analytics: {
		other_categories: 'Other categories'
	},
	details: {
		category: 'Category',
		currency: 'Currency',
		payment: 'Payment method',
		notes: 'Notes',
		notes_placeholder: 'Tap to add a comment'
	},
	filters: {
		title: 'Filters',
		clear: 'Clear',
		search: 'Search',
		empty: 'No filters available',
		tabs: {
			category: 'Category',
			service: 'Service',
			tender: 'Tender',
			currency: 'Currency'
		}
	},
	time_mode: {
		future: 'Upcoming',
		all: 'All time'
	},
	view_mode: {
		subscriptions: 'Subscriptions'
	},
	refresh_success: {
		title: 'Transactions synced',
		description: 'Past and upcoming entries are up to date'
	}
};

const defaultCategories: LocaleRootT['category'] = {
	ai: 'AI',
	automotive: 'Automotive',
	beauty_care: 'Beauty & Care',
	bundles: 'Bundles',
	cloud_storage: 'Cloud Storage',
	creator_platforms: 'Creator Platforms',
	datings: 'Datings',
	design_and_creative: 'Design & Creative',
	developer_tools: 'Developer Tools',
	domains_and_dns: 'Domains & DNS',
	education: 'Education',
	finances_and_insurance: 'Finances & Insurance',
	food_and_delivery: 'Food & Delivery',
	gaming: 'Gaming',
	health_and_fitness: 'Health & Fitness',
	hosting_and_vps: 'Hosting & VPS',
	marketing: 'Marketing',
	music_and_audiobooks: 'Music & Audiobooks',
	news_and_reading: 'News & Reading',
	paas_and_deployment: 'PaaS & Deployment',
	pets: 'Pets',
	productivity: 'Productivity',
	shopping_and_memberships: 'Shopping & Memberships',
	smart_home_and_iot: 'Smart Home & IoT',
	social: 'Social',
	transportation: 'Transportation',
	travel_and_flights: 'Travel & Flights',
	utilities_and_bills: 'Utilities & Bills',
	vpn_and_security: 'VPN & Security',
	video_streaming: 'Video Streaming'
};

const english: LocaleRootT = {
	tokens: {
		regions,
		countries,
		currencies,
		languages
	},
	ios: {
		CFBundleDisplayName: 'Uha'
	},
	dates: {
		today: 'Today',
		tomorrow: 'Tomorrow',
		yesterday: 'Yesterday',
		day: 'Day',
		month: 'Month',
		year: 'Year',
		in_month: 'In {{month}}',
		in_year: 'In {{year}}',
		in_months: {
			0: 'In January',
			1: 'In February',
			2: 'In March',
			3: 'In April',
			4: 'In May',
			5: 'In June',
			6: 'In July',
			7: 'In August',
			8: 'In September',
			9: 'In October',
			10: 'In November',
			11: 'In December'
		}
	},
	rates: {
		error: {
			title: 'Rates update failed',
			description: 'Currency conversions may be inaccurate'
		},
		success: {
			title: 'Rates updated'
		}
	},
	category: defaultCategories,

	navbar: {
		transactions: {
			title: 'Home',
			go_to_today: 'Go to Today',
			view_list: 'List View',
			view_calendar: 'Calendar View',
			open_filters: 'Filters'
		},
		library: {
			root: 'Root',
			title: 'Library',
			categories: 'Categories',
			services: 'Services',
			payments: 'Payments',
			subscriptions: 'Subscriptions'
		},
		settings: {
			title: 'Settings',
			refresh_rates: 'Update Rates'
		},
		add: {
			title: 'New',
			service: 'New Service',
			category: 'New Category',
			payment: 'New Payment',
			subscription: 'New Subscription'
		}
	},

	transactions: transactionsScreen,
	library: libraryScreen,
	settings: settingsScreen,

	crossroad: {
		title: 'New entry',
		no_results: 'No results has been found',
		grid: {
			category: {
				title: 'Category',
				description: 'Group services by type'
			},
			service: {
				title: 'Service',
				description: 'A vendor or provider'
			},
			payment: {
				title: 'Payment',
				description: 'Card or payment method'
			},
			subscription: {
				title: 'Subscription',
				description: 'Create new subscription from scratch'
			}
		},
		add: {
			header: 'Find new Service',
			search_bar: 'Search service to add',
			search_results: 'Search Results',
			sections: {
				top_hit: 'Top Hit',
				verified: 'Verified',
				external: 'External'
			}
		}
	}
};

export default english;
