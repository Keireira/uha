type CurrencyCode =
	| 'AOA'
	| 'BWP'
	| 'BIF'
	| 'CDF'
	| 'CVE'
	| 'ETB'
	| 'GHS'
	| 'KES'
	| 'LRD'
	| 'LSL'
	| 'MUR'
	| 'MWK'
	| 'MZN'
	| 'NAD'
	| 'NGN'
	| 'RWF'
	| 'SCR'
	| 'SZL'
	| 'TZS'
	| 'UGX'
	| 'XAF'
	| 'XOF'
	| 'ZAR'
	| 'ZMW'
	| 'ALL'
	| 'BAM'
	| 'BGN'
	| 'CHF'
	| 'CZK'
	| 'DKK'
	| 'EUR'
	| 'GBP'
	| 'GEL'
	| 'GIP'
	| 'HRK'
	| 'HUF'
	| 'ILS'
	| 'ISK'
	| 'MDL'
	| 'MKD'
	| 'NOK'
	| 'PLN'
	| 'RON'
	| 'RSD'
	| 'RUB'
	| 'SEK'
	| 'TRY'
	| 'UAH'
	| 'CAD'
	| 'MXN'
	| 'USD'
	| 'BZD'
	| 'CRC'
	| 'GTQ'
	| 'HNL'
	| 'NIO'
	| 'PAB'
	| 'SVC'
	| 'ARS'
	| 'BOB'
	| 'BRL'
	| 'CLP'
	| 'COP'
	| 'GYD'
	| 'PEN'
	| 'PYG'
	| 'SRD'
	| 'UYU'
	| 'AWG'
	| 'BBD'
	| 'BMD'
	| 'BSD'
	| 'CUC'
	| 'CUP'
	| 'DOP'
	| 'HTG'
	| 'JMD'
	| 'KYD'
	| 'TTD'
	| 'XCD'
	| 'AMD'
	| 'AZN'
	| 'KGS'
	| 'KZT'
	| 'TJS'
	| 'UZS'
	| 'INR'
	| 'LKR'
	| 'NPR'
	| 'CNH'
	| 'CNY'
	| 'HKD'
	| 'JPY'
	| 'KRW'
	| 'MOP'
	| 'TWD'
	| 'KHR'
	| 'LAK'
	| 'MMK'
	| 'PHP'
	| 'SGD'
	| 'THB'
	| 'VND'
	| 'AUD'
	| 'FJD'
	| 'NZD'
	| 'PGK'
	| 'SBD'
	| 'TOP'
	| 'BCH'
	| 'BTC'
	| 'BTG'
	| 'DASH'
	| 'EOS'
	| 'ETH'
	| 'LTC'
	| 'XLM'
	| 'XRP'
	| 'AED'
	| 'OMR'
	| 'BDT'
	| 'IDR'
	| 'MYR'
	| 'EGP'
	| 'MVR';

type LanguageCode = 'en' | 'ru' | 'kk' | 'es' | 'ja';

export type LocaleRootT = {
	ios: {
		CFBundleDisplayName: string;
	};
	dates: {
		today: string;
		tomorrow: string;
		yesterday: string;
		day: string;
		month: string;
		year: string;
		in_month: string;
		in_year: string;
	};
	rates: {
		error: {
			title: string;
			description: string;
		};
		success: {
			title: string;
		};
	};
	languages: Record<LanguageCode, string>;
	currencies: Record<CurrencyCode, string>;

	navbar: {
		transactions: {
			title: string;
			go_to_today: string;
			view_list: string;
			view_calendar: string;
			open_filters: string;
		};
		library: {
			title: string;
			categories: string;
			services: string;
			payments: string;
		};
		settings: {
			title: string;
			refresh_rates: string;
		};
		add: {
			title: string;
			service: string;
			category: string;
			payment: string;
			subscription: string;
		};
	};

	transactions: {
		calendar: {
			total: string;
			no_txs: string;
		};
		details: {
			category: string;
			currency: string;
			payment: string;
			notes: string;
			notes_placeholder: string;
		};
		filters: {
			title: string;
			clear: string;
			search: string;
			empty: string;
			tabs: {
				category: string;
				service: string;
				tender: string;
				currency: string;
			};
		};
		time_mode: {
			future: string;
			all: string;
		};
		view_mode: {
			subscriptions: string;
		};
	};
	library: {
		search: {
			all: string;
			categories: string;
			services: string;
			payments: string;
		};
	};
	settings: {
		system: {
			notifications: {
				header: string;
				results: {
					denied: string;
					blocked: string;
					granted: string;
					limited: string;
				};
			};
			language: string;
		};
		appearance: {
			header: string;
			light: string;
			dark: string;
			oled: string;
		};
		preferences: {
			header: string;
			first_day: string;
			day_hint_us: string;
			day_hint_iso: string;
			max_horizon: string;
			years_unit: string;
		};
		general: {
			header: string;
		};
		currencies: {
			header: string;
			default_currency_code: string;
			recalc_currency_code: string;
			refresh_rates: string;
			search: string;
			primary: string;

			// target/region
			europe: string;
			north_america: string;
			central_america: string;
			south_america: string;
			caribbean: string;
			central_asia: string;
			south_asia: string;
			east_asia: string;
			southeast_asia: string;
			oceania: string;
			africa: string;
			cryptocurrency: string;
			other: string;
		};
		about: {
			sources: string;
			beta: string;
			version: string;
		};
		donations: {
			header: string;
			description: string;

			// unit.type
			patreon: string;
			github: string;
			boosty: string;
		};
		unlimited: {
			badge: string;
			active: string;
			upgrade: string;
		};
		data: {
			header: string;
			cancel: string;
			data_footer: string;

			db: {
				backup: {
					title: string;
					success: string;
					error: string;
				};
				restore: {
					title: string;
					success: string;
					error: string;
				};
			};

			csv: {
				export: {
					title: string;
					success: string;
					error: string;
				};
				import: {
					title: string;
					success: string;
					error: string;
				};
			};

			icloud: {
				sync: string;

				statuses: {
					checking: string;
					unavailable: string;
					backing_up: string;
					restoring: string;
					no_backup: string;
				};

				backup: {
					title: string;
					success: string;
					error: string;
				};

				restore: {
					title: string;
					success: string;
					error: string;
				};
			};
		};
		ai: {
			header: string;
			footer: string;
			status: string;
			toggle: string;
			supported: string;
			not_supported: string;
		};
		tip_jar: {
			header: string;
			thanks: string;
			error: string;

			products: {
				small_fry: string;
				good_catch: string;
				big_fish: string;
				whale: string;
			};
		};
	};
};
