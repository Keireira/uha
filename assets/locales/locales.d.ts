export type RegionsT = {
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
	other: string;
	cryptocurrency: string;
};

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

type CountriesList =
	| 'AF'
	| 'AL'
	| 'DZ'
	| 'AD'
	| 'AO'
	| 'AI'
	| 'AG'
	| 'AR'
	| 'AM'
	| 'AU'
	| 'AT'
	| 'AZ'
	| 'BS'
	| 'BH'
	| 'BD'
	| 'BB'
	| 'BY'
	| 'BE'
	| 'BZ'
	| 'BJ'
	| 'BM'
	| 'BT'
	| 'BO'
	| 'BA'
	| 'BW'
	| 'BR'
	| 'BN'
	| 'BG'
	| 'BF'
	| 'CV'
	| 'KH'
	| 'CM'
	| 'CA'
	| 'KY'
	| 'CF'
	| 'TD'
	| 'CL'
	| 'CN'
	| 'CO'
	| 'CD'
	| 'CG'
	| 'CR'
	| 'HR'
	| 'CY'
	| 'CZ'
	| 'CI'
	| 'DK'
	| 'DM'
	| 'DO'
	| 'EC'
	| 'EG'
	| 'SV'
	| 'EE'
	| 'SZ'
	| 'ET'
	| 'FJ'
	| 'FI'
	| 'FR'
	| 'GA'
	| 'GM'
	| 'GE'
	| 'DE'
	| 'GH'
	| 'GR'
	| 'GD'
	| 'GT'
	| 'GN'
	| 'GW'
	| 'GY'
	| 'HN'
	| 'HK'
	| 'HU'
	| 'IS'
	| 'IN'
	| 'ID'
	| 'IQ'
	| 'IE'
	| 'IL'
	| 'IT'
	| 'JM'
	| 'JP'
	| 'JO'
	| 'KZ'
	| 'KE'
	| 'KR'
	| 'KW'
	| 'KG'
	| 'LA'
	| 'LV'
	| 'LB'
	| 'LR'
	| 'LY'
	| 'LI'
	| 'LT'
	| 'LU'
	| 'MO'
	| 'MG'
	| 'MW'
	| 'MY'
	| 'MV'
	| 'ML'
	| 'MT'
	| 'MR'
	| 'MU'
	| 'MX'
	| 'FM'
	| 'MD'
	| 'MC'
	| 'MN'
	| 'ME'
	| 'MS'
	| 'MA'
	| 'MZ'
	| 'MM'
	| 'NA'
	| 'NR'
	| 'NP'
	| 'NL'
	| 'NZ'
	| 'NI'
	| 'NE'
	| 'NG'
	| 'MK'
	| 'NO'
	| 'OM'
	| 'PK'
	| 'PW'
	| 'PA'
	| 'PG'
	| 'PY'
	| 'PE'
	| 'PH'
	| 'PL'
	| 'PT'
	| 'PS'
	| 'QA'
	| 'RO'
	| 'RU'
	| 'RW'
	| 'KN'
	| 'LC'
	| 'VC'
	| 'WS'
	| 'ST'
	| 'SA'
	| 'SN'
	| 'RS'
	| 'SC'
	| 'SL'
	| 'SG'
	| 'SK'
	| 'SI'
	| 'SB'
	| 'ZA'
	| 'ES'
	| 'LK'
	| 'SR'
	| 'SE'
	| 'CH'
	| 'TW'
	| 'TJ'
	| 'TZ'
	| 'TH'
	| 'TO'
	| 'TT'
	| 'TN'
	| 'TR'
	| 'TM'
	| 'TC'
	| 'UG'
	| 'UA'
	| 'AE'
	| 'GB'
	| 'US'
	| 'UY'
	| 'UZ'
	| 'VU'
	| 'VE'
	| 'VN'
	| 'VG'
	| 'XK'
	| 'YE'
	| 'ZM'
	| 'ZW';

type LanguageCode =
	| 'en'
	| 'ru'
	| 'kk'
	| 'es'
	| 'ja'
	| 'de'
	| 'fr'
	| 'it'
	| 'pt'
	| 'nl'
	| 'pl'
	| 'cs'
	| 'hu'
	| 'ro'
	| 'uk'
	| 'tr'
	| 'ar'
	| 'he'
	| 'ko'
	| 'zh'
	| 'th'
	| 'vi'
	| 'id'
	| 'ms'
	| 'hi'
	| 'sv'
	| 'da'
	| 'nb'
	| 'fi';

type CategorySlugs =
	| 'ai'
	| 'automotive'
	| 'beauty_care'
	| 'bundles'
	| 'cloud_storage'
	| 'creator_platforms'
	| 'datings'
	| 'design_and_creative'
	| 'developer_tools'
	| 'domains_and_dns'
	| 'education'
	| 'finances_and_insurance'
	| 'food_and_delivery'
	| 'gaming'
	| 'health_and_fitness'
	| 'hosting_and_vps'
	| 'marketing'
	| 'music_and_audiobooks'
	| 'news_and_reading'
	| 'paas_and_deployment'
	| 'pets'
	| 'productivity'
	| 'shopping_and_memberships'
	| 'smart_home_and_iot'
	| 'social'
	| 'transportation'
	| 'travel_and_flights'
	| 'utilities_and_bills'
	| 'vpn_and_security'
	| 'video_streaming';

export type LocaleRootT = {
	tokens: {
		regions: RegionsT;
		countries: Record<CountriesList, string>;
		languages: Record<LanguageCode, string>;
		currencies: Record<CurrencyCode, string>;
	};
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
		/*
		 * Pre-formatted "in <Month>" phrase for locales whose month names inflect (e.g. ru, kk).
		 * Indexed 0–11 to match `Date.getMonth()`.
		 **/
		in_months: Record<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11, string>;
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
	category: Record<CategorySlugs, string>;

	navbar: {
		transactions: {
			title: string;
			go_to_today: string;
			view_list: string;
			view_calendar: string;
			open_filters: string;
		};
		library: {
			root: string;
			title: string;
			categories: string;
			services: string;
			payments: string;
			subscriptions: string;
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
		analytics: {
			other_categories: string;
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
		refresh_success: {
			title: string;
			description: string;
		};
	};
	library: {
		title: string;
		grid: {
			categories: {
				title: string;
				description: string;
			};
			services: {
				title: string;
				description: string;
			};
			payments: {
				title: string;
				description: string;
			};
			subscriptions: {
				title: string;
				description: string;
			};
		};

		delete_blocked: {
			title: string;
			default_category: string;

			/**
			 * Plural-aware "in use" warning. The base keys (`category`, `service`, `payment`)
			 * are looked up by i18next with the appropriate CLDR suffix
			 * (`_one`, `_few`, `_many`, `_other`) based on the active locale and `{{count}}`.
			 */
			category_one?: string;
			category_few?: string;
			category_many?: string;
			category_other?: string;
			service_one?: string;
			service_few?: string;
			service_many?: string;
			service_other?: string;
			payment_one?: string;
			payment_few?: string;
			payment_many?: string;
			payment_other?: string;
		};
		details: {
			save: string;
			id_copied: string;
			section: {
				identity: string;
				appearance: string;
				other: string;
			};
			fields: {
				slug: string;
				id: string;
				title: string;
				emoji: string;
				color: string;
				comment: string;
				card: string;
				category: string;
				symbol: string;
				logo_url: string;
				bundle_id: string;
				ref_link: string;
			};
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
			default_currency: string;
			recalc_currency: string;
			refresh_rates: string;
			search: string;
			primary: string;
		};
		sources: {
			header: string;
			footer: string;
			search: string;
			primary: string;
			language: string;
			appstore: string;
			playstore: string;
			web: string;
			brandfetch: string;
			logo_dev: string;
		};
		about: {
			bug: string;
			website: string;
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
			ko_fi: string;
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
	crossroad: {
		title: string;
		no_results: string;
		grid: {
			category: {
				title: string;
				description: string;
			};
			service: {
				title: string;
				description: string;
			};
			payment: {
				title: string;
				description: string;
			};
			subscription: {
				title: string;
				description: string;
			};
		};
		add: {
			header: string;
			search_bar: string;
			search_results: string;
			sections: {
				top_hit: string;
				verified: string;
				external: string;
			};
		};
	};
};
