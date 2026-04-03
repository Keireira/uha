import type { LocaleRootT } from './locales.d';

const i18nLanguages: LocaleRootT['languages'] = {
	en: 'English',
	ru: 'Russian',
	kk: 'Kazakh',
	es: 'Spanish',
	ja: 'Japanese'
};

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
		default_currency_code: 'Default Currency',
		recalc_currency_code: 'Recalc Currency',
		refresh_rates: 'Exchange Rates',
		search: 'Search currencies',
		primary: 'Primary',

		// target/region
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
		cryptocurrency: 'Cryptocurrencies',
		other: 'Other'
	},
	about: {
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
		boosty: 'Boosty'
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
	search: {
		all: 'Search everywhere',
		categories: 'Search in categories',
		services: 'Search in services',
		payments: 'Search in payments'
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Total',
		no_txs: 'No transactions'
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
	}
};

const currenciesList: LocaleRootT['currencies'] = {
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
	HRK: 'Croatian Kuna',
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
	CUC: 'Cuban Convertible Peso',
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

const defaultCategories: LocaleRootT['default_categories'] = {
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
		in_year: 'In {{year}}'
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
	languages: i18nLanguages,
	default_categories: defaultCategories,
	currencies: currenciesList,

	navbar: {
		transactions: {
			title: 'Home',
			go_to_today: 'Go to Today',
			view_list: 'List View',
			view_calendar: 'Calendar View',
			open_filters: 'Filters'
		},
		library: {
			title: 'Library',
			categories: 'Categories',
			services: 'Services',
			payments: 'Payments'
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
	settings: settingsScreen
};

export default english;
