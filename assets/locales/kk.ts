import type { LocaleRootT } from './locales.d';

const i18nLanguages: LocaleRootT['languages'] = {
	en: 'Ағылшын',
	ru: 'Орыс',
	kk: 'Қазақ',
	es: 'Испан',
	ja: 'Жапон'
};

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
		default_currency_code: 'Негізгі валюта',
		recalc_currency_code: 'Қайта есептеу валютасы',
		refresh_rates: 'Айырбас бағамы',
		search: 'Валюта іздеу',
		primary: 'Негізгі',

		// target/region
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
		cryptocurrency: 'Криптовалюталар',
		other: 'Басқа'
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

const currenciesList: LocaleRootT['currencies'] = {
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

const kazakh: LocaleRootT = {
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
	languages: i18nLanguages,
	currencies: currenciesList,

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
	settings: settingsScreen
};

export default kazakh;
