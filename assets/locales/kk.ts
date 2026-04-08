import type { LocaleRootT, RegionsT, CurrencyCode, LanguageCode, CountriesList } from './locales.d';

// Tokens
const regions: RegionsT = {
	europe: 'Еуропа',
	north_america: 'Солтүстік Америка',
	central_america: 'Орталық Америка',
	south_america: 'Оңтүстік Америка',
	caribbean: 'Кариб',
	central_asia: 'Орталық Азия',
	south_asia: 'Оңтүстік Азия',
	east_asia: 'Шығыс Азия',
	southeast_asia: 'Оңтүстік-Шығыс Азия',
	oceania: 'Океания',
	africa: 'Африка',
	other: 'Басқа',
	cryptocurrency: 'Криптовалюталар'
};
const countries: Record<CountriesList, string> = {
	AF: 'Ауғанстан',
	AL: 'Албания',
	DZ: 'Алжир',
	AD: 'Андорра',
	AO: 'Ангола',
	AI: 'Ангилья',
	AG: 'Антигуа және Барбуда',
	AR: 'Аргентина',
	AM: 'Армения',
	AU: 'Австралия',
	AT: 'Австрия',
	AZ: 'Әзірбайжан',
	BS: 'Багам аралдары',
	BH: 'Бахрейн',
	BD: 'Бангладеш',
	BB: 'Барбадос',
	BY: 'Беларусь',
	BE: 'Бельгия',
	BZ: 'Белиз',
	BJ: 'Бенин',
	BM: 'Бермуд аралдары',
	BT: 'Бутан',
	BO: 'Боливия',
	BA: 'Босния және Герцеговина',
	BW: 'Ботсвана',
	BR: 'Бразилия',
	BN: 'Бруней',
	BG: 'Болгария',
	BF: 'Буркина-Фасо',
	CV: 'Кабо-Верде',
	KH: 'Камбоджа',
	CM: 'Камерун',
	CA: 'Канада',
	KY: 'Кайман аралдары',
	CF: 'Орталық Африка Республикасы',
	TD: 'Чад',
	CL: 'Чили',
	CN: 'Қытай',
	CO: 'Колумбия',
	CD: 'Конго (ДР)',
	CG: 'Конго',
	CR: 'Коста-Рика',
	HR: 'Хорватия',
	CY: 'Кипр',
	CZ: 'Чехия',
	CI: "Кот-д'Ивуар",
	DK: 'Дания',
	DM: 'Доминика',
	DO: 'Доминикан Республикасы',
	EC: 'Эквадор',
	EG: 'Мысыр',
	SV: 'Сальвадор',
	EE: 'Эстония',
	SZ: 'Эсватини',
	ET: 'Эфиопия',
	FJ: 'Фиджи',
	FI: 'Финляндия',
	FR: 'Франция',
	GA: 'Габон',
	GM: 'Гамбия',
	GE: 'Грузия',
	DE: 'Германия',
	GH: 'Гана',
	GR: 'Грекия',
	GD: 'Гренада',
	GT: 'Гватемала',
	GN: 'Гвинея',
	GW: 'Гвинея-Бисау',
	GY: 'Гайана',
	HN: 'Гондурас',
	HK: 'Гонконг',
	HU: 'Венгрия',
	IS: 'Исландия',
	IN: 'Үндістан',
	ID: 'Индонезия',
	IQ: 'Ирак',
	IE: 'Ирландия',
	IL: 'Израиль',
	IT: 'Италия',
	JM: 'Ямайка',
	JP: 'Жапония',
	JO: 'Иордания',
	KZ: 'Қазақстан',
	KE: 'Кения',
	KR: 'Корея',
	KW: 'Кувейт',
	KG: 'Қырғызстан',
	LA: 'Лаос',
	LV: 'Латвия',
	LB: 'Ливан',
	LR: 'Либерия',
	LY: 'Ливия',
	LI: 'Лихтенштейн',
	LT: 'Литва',
	LU: 'Люксембург',
	MO: 'Макао',
	MG: 'Мадагаскар',
	MW: 'Малави',
	MY: 'Малайзия',
	MV: 'Мальдив аралдары',
	ML: 'Мали',
	MT: 'Мальта',
	MR: 'Мавритания',
	MU: 'Маврикий',
	MX: 'Мексика',
	FM: 'Микронезия',
	MD: 'Молдова',
	MC: 'Монако',
	MN: 'Моңғолия',
	ME: 'Черногория',
	MS: 'Монтсеррат',
	MA: 'Марокко',
	MZ: 'Мозамбик',
	MM: 'Мьянма',
	NA: 'Намибия',
	NR: 'Науру',
	NP: 'Непал',
	NL: 'Нидерланд',
	NZ: 'Жаңа Зеландия',
	NI: 'Никарагуа',
	NE: 'Нигер',
	NG: 'Нигерия',
	MK: 'Солтүстік Македония',
	NO: 'Норвегия',
	OM: 'Оман',
	PK: 'Пәкістан',
	PW: 'Палау',
	PA: 'Панама',
	PG: 'Папуа — Жаңа Гвинея',
	PY: 'Парагвай',
	PE: 'Перу',
	PH: 'Филиппин',
	PL: 'Польша',
	PT: 'Португалия',
	PS: 'Палестина',
	QA: 'Катар',
	RO: 'Румыния',
	RU: 'Ресей',
	RW: 'Руанда',
	KN: 'Сент-Китс және Невис',
	LC: 'Сент-Люсия',
	VC: 'Сент-Винсент және Гренадиндер',
	WS: 'Самоа',
	ST: 'Сан-Томе және Принсипи',
	SA: 'Сауд Арабиясы',
	SN: 'Сенегал',
	RS: 'Сербия',
	SC: 'Сейшел аралдары',
	SL: 'Сьерра-Леоне',
	SG: 'Сингапур',
	SK: 'Словакия',
	SI: 'Словения',
	SB: 'Соломон аралдары',
	ZA: 'Оңтүстік Африка',
	ES: 'Испания',
	LK: 'Шри-Ланка',
	SR: 'Суринам',
	SE: 'Швеция',
	CH: 'Швейцария',
	TW: 'Тайвань',
	TJ: 'Тәжікстан',
	TZ: 'Танзания',
	TH: 'Таиланд',
	TO: 'Тонга',
	TT: 'Тринидад және Тобаго',
	TN: 'Тунис',
	TR: 'Түркия',
	TM: 'Түрікменстан',
	TC: 'Теркс және Кайкос аралдары',
	UG: 'Уганда',
	UA: 'Украина',
	AE: 'Біріккен Араб Әмірліктері',
	GB: 'Ұлыбритания',
	US: 'Америка Құрама Штаттары',
	UY: 'Уругвай',
	UZ: 'Өзбекстан',
	VU: 'Вануату',
	VE: 'Венесуэла',
	VN: 'Вьетнам',
	VG: 'Британ Виргин аралдары',
	XK: 'Косово',
	YE: 'Йемен',
	ZM: 'Замбия',
	ZW: 'Зимбабве'
};
const languages: Record<LanguageCode, string> = {
	en: 'Ағылшын',
	ru: 'Орыс',
	kk: 'Қазақ',
	es: 'Испан',
	ja: 'Жапон',
	de: 'Неміс',
	fr: 'Француз',
	it: 'Итальян',
	pt: 'Португал',
	nl: 'Нидерланд',
	pl: 'Поляк',
	cs: 'Чех',
	hu: 'Мажар',
	ro: 'Румын',
	uk: 'Украин',
	tr: 'Түрік',
	ar: 'Араб',
	he: 'Иврит',
	ko: 'Корей',
	zh: 'Қытай',
	th: 'Тай',
	vi: 'Вьетнам',
	id: 'Индонезия',
	ms: 'Малай',
	hi: 'Хинди',
	sv: 'Швед',
	da: 'Дат',
	nb: 'Норвег',
	fi: 'Фин'
};
const currencies: Record<CurrencyCode, string> = {
	AOA: 'Ангола кванзасы',
	BWP: 'Ботсвана пуласы',
	BIF: 'Бурунди франкі',
	CDF: 'Конго франкі',
	CVE: 'Кабо-Верде эскудосы',
	ETB: 'Эфиопия быры',
	GHS: 'Гана седиі',
	KES: 'Кения шиллингі',
	LRD: 'Либерия доллары',
	LSL: 'Лесото лотиі',
	MUR: 'Маврикий рупиясы',
	MWK: 'Малави квачасы',
	MZN: 'Мозамбик метикалы',
	NAD: 'Намибия доллары',
	NGN: 'Нигерия найрасы',
	RWF: 'Руанда франкі',
	SCR: 'Сейшел рупиясы',
	SZL: 'Свазиленд лилангениі',
	TZS: 'Танзания шиллингі',
	UGX: 'Уганда шиллингі',
	XAF: 'Орталық Африка КФА франкі',
	XOF: 'Батыс Африка КФА франкі',
	ZAR: 'Оңтүстік Африка рэнді',
	ZMW: 'Замбия квачасы',
	ALL: 'Албания лекі',
	BAM: 'Босния айырбасталатын маркасы',
	BGN: 'Болгария леві',
	CHF: 'Швейцария франкі',
	CZK: 'Чехия кронасы',
	DKK: 'Дания кронасы',
	EUR: 'Еуро',
	GBP: 'Британ фунты',
	GEL: 'Грузия лариі',
	GIP: 'Гибралтар фунты',
	HRK: 'Хорватия кунасы',
	HUF: 'Венгрия форинті',
	ILS: 'Израиль шекелі',
	ISK: 'Исландия кронасы',
	MDL: 'Молдова лейі',
	MKD: 'Македония денары',
	NOK: 'Норвегия кронасы',
	PLN: 'Польша злотыйі',
	RON: 'Румыния лейі',
	RSD: 'Сербия динары',
	RUB: 'Ресей рублі',
	SEK: 'Швеция кронасы',
	TRY: 'Түрік лирасы',
	UAH: 'Украина гривнасы',
	CAD: 'Канада доллары',
	MXN: 'Мексика песосы',
	USD: 'АҚШ доллары',
	BZD: 'Белиз доллары',
	CRC: 'Коста-Рика колоны',
	GTQ: 'Гватемала кетсалі',
	HNL: 'Гондурас лемпирасы',
	NIO: 'Никарагуа кордобасы',
	PAB: 'Панама бальбоасы',
	SVC: 'Сальвадор колоны',
	ARS: 'Аргентина песосы',
	BOB: 'Боливия боливианосы',
	BRL: 'Бразилия реалы',
	CLP: 'Чили песосы',
	COP: 'Колумбия песосы',
	GYD: 'Гайана доллары',
	PEN: 'Перу солі',
	PYG: 'Парагвай гуараниі',
	SRD: 'Суринам доллары',
	UYU: 'Уругвай песосы',
	AWG: 'Аруба флорині',
	BBD: 'Барбадос доллары',
	BMD: 'Бермуд доллары',
	BSD: 'Багам доллары',
	CUC: 'Куба айырбасталатын песосы',
	CUP: 'Куба песосы',
	DOP: 'Доминикан песосы',
	HTG: 'Гаити гурды',
	JMD: 'Ямайка доллары',
	KYD: 'Кайман аралдары доллары',
	TTD: 'Тринидад және Тобаго доллары',
	XCD: 'Шығыс Кариб доллары',
	AMD: 'Армения драмы',
	AZN: 'Әзірбайжан манаты',
	KGS: 'Қырғызстан сомы',
	KZT: 'Теңге',
	TJS: 'Тәжікстан сомониі',
	UZS: 'Өзбекстан сумы',
	INR: 'Үндістан рупиясы',
	LKR: 'Шри-Ланка рупиясы',
	NPR: 'Непал рупиясы',
	CNH: 'Қытай юані (офшор)',
	CNY: 'Қытай юані',
	HKD: 'Гонконг доллары',
	JPY: 'Жапон иенасы',
	KRW: 'Оңтүстік Корея воны',
	MOP: 'Макао патакасы',
	TWD: 'Жаңа Тайвань доллары',
	KHR: 'Камбоджа риелі',
	LAK: 'Лаос кипі',
	MMK: 'Мьянма кьяты',
	PHP: 'Филиппин песосы',
	SGD: 'Сингапур доллары',
	THB: 'Тай баты',
	VND: 'Вьетнам донгі',
	AUD: 'Австралия доллары',
	FJD: 'Фиджи доллары',
	NZD: 'Жаңа Зеландия доллары',
	PGK: 'Папуа — Жаңа Гвинея кинасы',
	SBD: 'Соломон аралдары доллары',
	TOP: 'Тонга паангасы',
	BCH: 'Bitcoin Cash',
	BTC: 'Bitcoin',
	BTG: 'Bitcoin Gold',
	DASH: 'Dash',
	EOS: 'EOS',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	XLM: 'Stellar Lumens',
	XRP: 'Ripple',
	AED: 'БАЭ дирхамы',
	OMR: 'Оман риалы',
	BDT: 'Бангладеш такасы',
	IDR: 'Индонезия рупиясы',
	MYR: 'Малайзия ринггиті',
	EGP: 'Мысыр фунты',
	MVR: 'Мальдив руфиясы'
};

// Screens
const settingsScreen: LocaleRootT['settings'] = {
	system: {
		notifications: {
			header: 'Хабарландырулар',
			results: {
				denied: 'Сұралмаған',
				blocked: 'Өшірілген',
				granted: 'Қосылған',
				limited: 'Қосылған'
			}
		},
		language: 'Тіл'
	},
	appearance: {
		header: 'Сыртқы түр',
		light: 'Жарық',
		dark: 'Қараңғы',
		oled: 'OLED'
	},
	preferences: {
		header: 'Параметрлер',
		first_day: 'Аптаның бірінші күні',
		max_horizon: 'Макс. кезең',
		years_unit: 'ж.',
		day_hint_us: 'Американдық',
		day_hint_iso: 'Халықаралық'
	},
	general: {
		header: 'Жүйе'
	},
	currencies: {
		header: 'Валюталар',
		default_currency: 'Негізгі валюта',
		recalc_currency: 'Қайта есептеу валютасы',
		refresh_rates: 'Айырбас бағамы',
		search: 'Валюта іздеу',
		primary: 'Негізгі'
	},
	sources: {
		header: 'Іздеу көздері',
		footer: 'Тексерілген нәтижелер осы параметрлерге қарамастан әрқашан көрсетіледі.',
		search: 'Іздеу',
		primary: 'Негізгі',
		language: 'Тіл',
		appstore: 'App Store',
		playstore: 'Google Play',
		web: 'Web',
		brandfetch: 'Brandfetch',
		logo_dev: 'logo.dev'
	},
	about: {
		sources: 'Дереккөздер',
		beta: 'Бетаға қосылу',
		version: 'Нұсқа'
	},
	donations: {
		header: 'Қолдау',
		description: 'Uha жеке әзірлеушімен жасалған. Сіздің қолдауыңыз оны дамытуға көмектеседі.',

		// unit.type
		patreon: 'Patreon',
		github: 'GitHub',
		boosty: 'Boosty'
	},
	unlimited: {
		badge: 'Unlimited',
		active: 'Барлық мүмкіндіктер ашық',
		upgrade: 'Барлық мүмкіндіктерді ашу'
	},
	data: {
		header: 'Деректер',
		cancel: 'Болдырмау',
		data_footer: 'Кез келген сақтық көшірмені қалпына келтіру бар деректерді қайта жазады.',

		db: {
			backup: {
				title: 'Сақтық көшірме',
				success: 'Сақтық көшірме жасалды',
				error: 'Сақтық көшірме сәтсіз'
			},
			restore: {
				title: 'Қалпына келтіру',
				success: 'Деректер қалпына келтірілді',
				error: 'Деректерді қалпына келтіру сәтсіз'
			}
		},

		csv: {
			export: {
				title: 'CSV-ге экспорт',
				success: 'Экспорт дайын',
				error: 'Экспорт сәтсіз'
			},
			import: {
				title: 'CSV-ден қалпына келтіру',
				success: 'Деректер импортталды',
				error: 'Импорт сәтсіз'
			}
		},

		icloud: {
			sync: 'iCloud синхрондау',

			statuses: {
				checking: 'Тексеру...',
				unavailable: 'iCloud-қа кіріңіз',
				backing_up: 'Сақтық көшірме жасалуда...',
				restoring: 'Қалпына келтіру...',
				no_backup: 'Сақтық көшірме жоқ'
			},

			backup: {
				title: 'iCloud-қа сақтау',
				success: 'iCloud-қа сақталды',
				error: 'iCloud сақтық көшірмесі сәтсіз'
			},

			restore: {
				title: 'iCloud-тан қалпына келтіру',
				success: 'iCloud-тан қалпына келтірілді',
				error: 'iCloud қалпына келтіру сәтсіз'
			}
		}
	},
	ai: {
		header: 'AI мүмкіндіктері',
		footer: 'Форма ұсыныстары тегін. Басқа AI мүмкіндіктері үшін Unlimited қажет.',
		status: 'Құрылғы күйі',
		toggle: 'Құрылғыдағы AI',
		supported: 'Қолжетімді',
		not_supported: 'Қолжетімсіз'
	},
	tip_jar: {
		header: 'Чайлар',
		thanks: 'Қолдауыңызға рахмет!',
		error: 'Чай өңдеу кезінде белгісіз қате орын алды.',

		products: {
			small_fry: 'Ұсақ балық',
			good_catch: 'Жақсы аулау',
			big_fish: 'Үлкен балық',
			whale: 'Кит'
		}
	}
};

const libraryScreen: LocaleRootT['library'] = {
	search: {
		all: 'Барлық жерден іздеу',
		categories: 'Санаттардан іздеу',
		services: 'Қызметтерден іздеу',
		payments: 'Төлемдерден іздеу'
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Барлығы',
		no_txs: 'Транзакциялар жоқ'
	},
	details: {
		category: 'Санат',
		currency: 'Валюта',
		payment: 'Төлем әдісі',
		notes: 'Жазбалар',
		notes_placeholder: 'Пікір қосу үшін басыңыз'
	},
	filters: {
		title: 'Сүзгілер',
		clear: 'Тазалау',
		search: 'Іздеу',
		empty: 'Сүзгілер жоқ',
		tabs: {
			category: 'Санат',
			service: 'Қызмет',
			tender: 'Төлем құралы',
			currency: 'Валюта'
		}
	},
	time_mode: {
		future: 'Алдағы',
		all: 'Барлық уақыт'
	},
	view_mode: {
		subscriptions: 'Жазылымдар'
	}
};

const defaultCategories: LocaleRootT['category'] = {
	ai: 'ЖИ',
	automotive: 'Автокөлік',
	beauty_care: 'Сұлулық және күтім',
	bundles: 'Пакеттер',
	cloud_storage: 'Бұлттық сақтау',
	creator_platforms: 'Авторлар платформасы',
	datings: 'Танысу',
	design_and_creative: 'Дизайн және шығармашылық',
	developer_tools: 'Әзірлеуші құралдары',
	domains_and_dns: 'Домендер және DNS',
	education: 'Білім',
	finances_and_insurance: 'Қаржы және сақтандыру',
	food_and_delivery: 'Тамақ және жеткізу',
	gaming: 'Ойындар',
	health_and_fitness: 'Денсаулық және фитнес',
	hosting_and_vps: 'Хостинг және VPS',
	marketing: 'Маркетинг',
	music_and_audiobooks: 'Музыка және аудиокітаптар',
	news_and_reading: 'Жаңалықтар және оқу',
	paas_and_deployment: 'PaaS және орналастыру',
	pets: 'Үй жануарлары',
	productivity: 'Өнімділік',
	shopping_and_memberships: 'Сатып алу және мүшелік',
	smart_home_and_iot: 'Ақылды үй және IoT',
	social: 'Әлеуметтік желілер',
	transportation: 'Көлік',
	travel_and_flights: 'Саяхат және ұшулар',
	utilities_and_bills: 'Коммуналдық және шоттар',
	vpn_and_security: 'VPN және қауіпсіздік',
	video_streaming: 'Бейне стриминг'
};

const kazakh: LocaleRootT = {
	tokens: { regions, countries, currencies, languages },
	ios: {
		CFBundleDisplayName: 'Uha'
	},
	dates: {
		today: 'Бүгін',
		tomorrow: 'Ертең',
		yesterday: 'Кеше',
		day: 'Күн',
		month: 'Ай',
		year: 'Жыл',
		in_month: '{{month}} айында',
		in_year: '{{year}} жылында'
	},
	rates: {
		error: {
			title: 'Бағамдарды жаңарту сәтсіз',
			description: 'Валюта айырбасы дәл болмауы мүмкін'
		},
		success: {
			title: 'Бағамдар жаңартылды'
		}
	},
	category: defaultCategories,

	navbar: {
		transactions: {
			title: 'Басты',
			go_to_today: 'Бүгінге өту',
			view_list: 'Тізім',
			view_calendar: 'Күнтізбе',
			open_filters: 'Сүзгілер'
		},
		library: {
			title: 'Кітапхана',
			categories: 'Санаттар',
			services: 'Қызметтер',
			payments: 'Төлемдер'
		},
		settings: {
			title: 'Параметрлер',
			refresh_rates: 'Бағамдарды жаңарту'
		},
		add: {
			title: 'Жаңа',
			service: 'Жаңа қызмет',
			category: 'Жаңа санат',
			payment: 'Жаңа төлем',
			subscription: 'Жаңа жазылым'
		}
	},

	transactions: transactionsScreen,
	library: libraryScreen,
	settings: settingsScreen,

	crossroad: {
		grid: {
			category: {
				title: 'Санат',
				description: 'Қызметтерді топтау'
			},
			service: {
				title: 'Қызмет',
				description: 'Қолданба немесе қызмет'
			},
			payment: {
				title: 'Төлем тәсілі',
				description: 'Карта немесе басқа төлем тәсілі'
			},
			subscription: {
				title: 'Жазылымдар',
				description: 'Өкінішті (◞‸◟)'
			}
		},
		add: {
			header: 'Қызмет іздеу',
			search_bar: 'Қызметті іздеу',
			no_results: 'Ештеңе табылмады',
			search_results: 'Іздеу нәтижелері',
			sections: {
				top_hit: 'Ең жақсы сәйкестік',
				verified: 'Тексерілген',
				external: 'Сыртқы'
			}
		}
	}
};

export default kazakh;
