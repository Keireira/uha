import type { LocaleRootT, RegionsT, CurrencyCode, LanguageCode, CountriesList } from './locales.d';

const regions: RegionsT = {
	europe: 'Европа',
	north_america: 'Северная Америка',
	central_america: 'Центральная Америка',
	south_america: 'Южная Америка',
	caribbean: 'Карибский бассейн',
	central_asia: 'Центральная Азия',
	south_asia: 'Южная Азия',
	east_asia: 'Восточная Азия',
	southeast_asia: 'Юго-Восточная Азия',
	oceania: 'Океания',
	africa: 'Африка',
	other: 'Другие',
	cryptocurrency: 'Криптовалюты'
};
const countries: Record<CountriesList, string> = {
	AF: 'Афганистан',
	AL: 'Албания',
	DZ: 'Алжир',
	AD: 'Андорра',
	AO: 'Ангола',
	AI: 'Ангилья',
	AG: 'Антигуа и Барбуда',
	AR: 'Аргентина',
	AM: 'Армения',
	AU: 'Австралия',
	AT: 'Австрия',
	AZ: 'Азербайджан',
	BS: 'Багамские Острова',
	BH: 'Бахрейн',
	BD: 'Бангладеш',
	BB: 'Барбадос',
	BY: 'Беларусь',
	BE: 'Бельгия',
	BZ: 'Белиз',
	BJ: 'Бенин',
	BM: 'Бермудские Острова',
	BT: 'Бутан',
	BO: 'Боливия',
	BA: 'Босния и Герцеговина',
	BW: 'Ботсвана',
	BR: 'Бразилия',
	BN: 'Бруней',
	BG: 'Болгария',
	BF: 'Буркина-Фасо',
	CV: 'Кабо-Верде',
	KH: 'Камбоджа',
	CM: 'Камерун',
	CA: 'Канада',
	KY: 'Каймановы Острова',
	CF: 'ЦАР',
	TD: 'Чад',
	CL: 'Чили',
	CN: 'Китай',
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
	DO: 'Доминиканская Республика',
	EC: 'Эквадор',
	EG: 'Египет',
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
	GR: 'Греция',
	GD: 'Гренада',
	GT: 'Гватемала',
	GN: 'Гвинея',
	GW: 'Гвинея-Бисау',
	GY: 'Гайана',
	HN: 'Гондурас',
	HK: 'Гонконг',
	HU: 'Венгрия',
	IS: 'Исландия',
	IN: 'Индия',
	ID: 'Индонезия',
	IQ: 'Ирак',
	IE: 'Ирландия',
	IL: 'Израиль',
	IT: 'Италия',
	JM: 'Ямайка',
	JP: 'Япония',
	JO: 'Иордания',
	KZ: 'Казахстан',
	KE: 'Кения',
	KR: 'Корея',
	KW: 'Кувейт',
	KG: 'Кыргызстан',
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
	MV: 'Мальдивы',
	ML: 'Мали',
	MT: 'Мальта',
	MR: 'Мавритания',
	MU: 'Маврикий',
	MX: 'Мексика',
	FM: 'Микронезия',
	MD: 'Молдова',
	MC: 'Монако',
	MN: 'Монголия',
	ME: 'Черногория',
	MS: 'Монтсеррат',
	MA: 'Марокко',
	MZ: 'Мозамбик',
	MM: 'Мьянма',
	NA: 'Намибия',
	NR: 'Науру',
	NP: 'Непал',
	NL: 'Нидерланды',
	NZ: 'Новая Зеландия',
	NI: 'Никарагуа',
	NE: 'Нигер',
	NG: 'Нигерия',
	MK: 'Северная Македония',
	NO: 'Норвегия',
	OM: 'Оман',
	PK: 'Пакистан',
	PW: 'Палау',
	PA: 'Панама',
	PG: 'Папуа — Новая Гвинея',
	PY: 'Парагвай',
	PE: 'Перу',
	PH: 'Филиппины',
	PL: 'Польша',
	PT: 'Португалия',
	PS: 'Палестина',
	QA: 'Катар',
	RO: 'Румыния',
	RU: 'Россия',
	RW: 'Руанда',
	KN: 'Сент-Китс и Невис',
	LC: 'Сент-Люсия',
	VC: 'Сент-Винсент и Гренадины',
	WS: 'Самоа',
	ST: 'Сан-Томе и Принсипи',
	SA: 'Саудовская Аравия',
	SN: 'Сенегал',
	RS: 'Сербия',
	SC: 'Сейшельские Острова',
	SL: 'Сьерра-Леоне',
	SG: 'Сингапур',
	SK: 'Словакия',
	SI: 'Словения',
	SB: 'Соломоновы Острова',
	ZA: 'Южная Африка',
	ES: 'Испания',
	LK: 'Шри-Ланка',
	SR: 'Суринам',
	SE: 'Швеция',
	CH: 'Швейцария',
	TW: 'Тайвань',
	TJ: 'Таджикистан',
	TZ: 'Танзания',
	TH: 'Таиланд',
	TO: 'Тонга',
	TT: 'Тринидад и Тобаго',
	TN: 'Тунис',
	TR: 'Турция',
	TM: 'Туркменистан',
	TC: 'Тёркс и Кайкос',
	UG: 'Уганда',
	UA: 'Украина',
	AE: 'ОАЭ',
	GB: 'Великобритания',
	US: 'США',
	UY: 'Уругвай',
	UZ: 'Узбекистан',
	VU: 'Вануату',
	VE: 'Венесуэла',
	VN: 'Вьетнам',
	VG: 'Виргинские Острова',
	XK: 'Косово',
	YE: 'Йемен',
	ZM: 'Замбия',
	ZW: 'Зимбабве'
};
const languages: Record<LanguageCode, string> = {
	en: 'Английский',
	ru: 'Русский',
	kk: 'Казахский',
	es: 'Испанский',
	ja: 'Японский',
	de: 'Немецкий',
	fr: 'Французский',
	it: 'Итальянский',
	pt: 'Португальский',
	nl: 'Нидерландский',
	pl: 'Польский',
	cs: 'Чешский',
	hu: 'Венгерский',
	ro: 'Румынский',
	uk: 'Украинский',
	tr: 'Турецкий',
	ar: 'Арабский',
	he: 'Иврит',
	ko: 'Корейский',
	zh: 'Китайский',
	th: 'Тайский',
	vi: 'Вьетнамский',
	id: 'Индонезийский',
	ms: 'Малайский',
	hi: 'Хинди',
	sv: 'Шведский',
	da: 'Датский',
	nb: 'Норвежский',
	fi: 'Финский'
};
const currencies: Record<CurrencyCode, string> = {
	AOA: 'Ангольская кванза',
	BWP: 'Ботсванская пула',
	BIF: 'Бурундийский франк',
	CDF: 'Конголезский франк',
	CVE: 'Эскудо Кабо-Верде',
	ETB: 'Эфиопский быр',
	GHS: 'Ганский седи',
	KES: 'Кенийский шиллинг',
	LRD: 'Либерийский доллар',
	LSL: 'Лоти Лесото',
	MUR: 'Маврикийская рупия',
	MWK: 'Малавийская квача',
	MZN: 'Мозамбикский метикал',
	NAD: 'Намибийский доллар',
	NGN: 'Нигерийская найра',
	RWF: 'Руандийский франк',
	SCR: 'Сейшельская рупия',
	SZL: 'Свазилендский лилангени',
	TZS: 'Танзанийский шиллинг',
	UGX: 'Угандийский шиллинг',
	XAF: 'Франк КФА BEAC',
	XOF: 'Франк КФА BCEAO',
	ZAR: 'Южноафриканский рэнд',
	ZMW: 'Замбийская квача',
	ALL: 'Албанский лек',
	BAM: 'Конвертируемая марка',
	BGN: 'Болгарский лев',
	CHF: 'Швейцарский франк',
	CZK: 'Чешская крона',
	DKK: 'Датская крона',
	EUR: 'Евро',
	GBP: 'Британский фунт',
	GEL: 'Грузинский лари',
	GIP: 'Гибралтарский фунт',
	HUF: 'Венгерский форинт',
	ILS: 'Израильский шекель',
	ISK: 'Исландская крона',
	MDL: 'Молдавский лей',
	MKD: 'Македонский денар',
	NOK: 'Норвежская крона',
	PLN: 'Польский злотый',
	RON: 'Румынский лей',
	RSD: 'Сербский динар',
	RUB: 'Российский рубль',
	SEK: 'Шведская крона',
	TRY: 'Турецкая лира',
	UAH: 'Украинская гривна',
	CAD: 'Канадский доллар',
	MXN: 'Мексиканское песо',
	USD: 'Доллар США',
	BZD: 'Белизский доллар',
	CRC: 'Костариканский колон',
	GTQ: 'Гватемальский кетсаль',
	HNL: 'Гондурасская лемпира',
	NIO: 'Никарагуанская кордоба',
	PAB: 'Панамский бальбоа',
	SVC: 'Сальвадорский колон',
	ARS: 'Аргентинское песо',
	BOB: 'Боливийский боливиано',
	BRL: 'Бразильский реал',
	CLP: 'Чилийское песо',
	COP: 'Колумбийское песо',
	GYD: 'Гайанский доллар',
	PEN: 'Перуанский соль',
	PYG: 'Парагвайский гуарани',
	SRD: 'Суринамский доллар',
	UYU: 'Уругвайское песо',
	AWG: 'Арубанский флорин',
	BBD: 'Барбадосский доллар',
	BMD: 'Бермудский доллар',
	BSD: 'Багамский доллар',
	CUP: 'Кубинское песо',
	DOP: 'Доминиканское песо',
	HTG: 'Гаитянский гурд',
	JMD: 'Ямайский доллар',
	KYD: 'Доллар Каймановых островов',
	TTD: 'Доллар Тринидада и Тобаго',
	XCD: 'Восточнокарибский доллар',
	AMD: 'Армянский драм',
	AZN: 'Азербайджанский манат',
	KGS: 'Киргизский сом',
	KZT: 'Тенге',
	TJS: 'Таджикский сомони',
	UZS: 'Узбекский сум',
	INR: 'Индийская рупия',
	LKR: 'Шри-ланкийская рупия',
	NPR: 'Непальская рупия',
	CNH: 'Китайский юань (офшор)',
	CNY: 'Китайский юань',
	HKD: 'Гонконгский доллар',
	JPY: 'Японская иена',
	KRW: 'Южнокорейская вона',
	MOP: 'Патака Макао',
	TWD: 'Новый тайваньский доллар',
	KHR: 'Камбоджийский риель',
	LAK: 'Лаосский кип',
	MMK: 'Мьянманский кьят',
	PHP: 'Филиппинское песо',
	SGD: 'Сингапурский доллар',
	THB: 'Тайский бат',
	VND: 'Вьетнамский донг',
	AUD: 'Австралийский доллар',
	FJD: 'Фиджийский доллар',
	NZD: 'Новозеландский доллар',
	PGK: 'Кина Папуа — Новой Гвинеи',
	SBD: 'Доллар Соломоновых Островов',
	TOP: 'Тонганская паанга',
	BCH: 'Bitcoin Cash',
	BTC: 'Bitcoin',
	BTG: 'Bitcoin Gold',
	DASH: 'Dash',
	EOS: 'EOS',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	XLM: 'Stellar Lumens',
	XRP: 'Ripple',
	AED: 'Дирхам ОАЭ',
	OMR: 'Оманский риал',
	BDT: 'Бангладешская така',
	IDR: 'Индонезийская рупия',
	MYR: 'Малайзийский ринггит',
	EGP: 'Египетский фунт',
	MVR: 'Мальдивская руфия'
};

const settingsScreen: LocaleRootT['settings'] = {
	system: {
		notifications: {
			header: 'Уведомления',
			results: {
				denied: 'Не запрошены',
				blocked: 'Отключены',
				granted: 'Включены',
				limited: 'Включены'
			}
		},
		language: 'Язык'
	},
	appearance: {
		header: 'Оформление',
		light: 'Светлая',
		dark: 'Тёмная',
		oled: 'OLED'
	},
	preferences: {
		header: 'Настройки',
		first_day: 'Первый день',
		max_horizon: 'Макс. горизонт',
		years_unit: 'лет',
		day_hint_us: 'Как в США',
		day_hint_iso: 'Как у всех'
	},
	general: {
		header: 'Система'
	},
	currencies: {
		header: 'Валюты',
		default_currency: 'Основная валюта',
		recalc_currency: 'Валюта пересчёта',
		refresh_rates: 'Курсы валют',
		search: 'Поиск валют',
		primary: 'Основные'
	},
	sources: {
		header: 'Источники поиска',
		footer: 'Верифицированные результаты отображаются всегда, независимо от этих настроек.',
		search: 'Поиск',
		primary: 'Основные',
		language: 'Язык',
		appstore: 'App Store',
		playstore: 'Google Play',
		web: 'Web',
		brandfetch: 'Brandfetch',
		logo_dev: 'logo.dev'
	},
	about: {
		bug: 'Сообщить об ошибке',
		website: 'uha.app',
		sources: 'Источники',
		beta: 'Бета-тестирование',
		version: 'Версия'
	},
	donations: {
		header: 'Поддержать',
		description: 'Uha создаётся одним инди-разработчиком. Твоя поддержка помогает проекту жить и развиваться.',

		// unit.type
		patreon: 'Patreon',
		github: 'GitHub',
		boosty: 'Boosty',
		ko_fi: 'Ko-fi'
	},
	unlimited: {
		badge: 'Unlimited',
		active: 'Все функции разблокированы',
		upgrade: 'Разблокировать все функции'
	},
	data: {
		header: 'Данные',
		cancel: 'Отмена',
		data_footer: 'Восстановление любой копии перезапишет все текущие данные.',

		db: {
			backup: {
				title: 'Резервная копия',
				success: 'Копия создана',
				error: 'Не удалось создать копию'
			},
			restore: {
				title: 'Восстановить',
				success: 'Данные восстановлены',
				error: 'Не удалось восстановить данные'
			}
		},

		csv: {
			export: {
				title: 'Экспорт в CSV',
				success: 'Экспорт готов',
				error: 'Ошибка экспорта'
			},
			import: {
				title: 'Импорт из CSV',
				success: 'Данные импортированы',
				error: 'Не удалось импортировать данные'
			}
		},

		icloud: {
			sync: 'Синхронизация iCloud',

			statuses: {
				checking: 'Проверка...',
				unavailable: 'Войди в iCloud',
				backing_up: 'Копирование...',
				restoring: 'Восстановление...',
				no_backup: 'Копий пока нет'
			},

			backup: {
				title: 'Копия в iCloud',
				success: 'Скопировано в iCloud',
				error: 'Ошибка копирования в iCloud'
			},

			restore: {
				title: 'Восстановить из iCloud',
				success: 'Восстановлено из iCloud',
				error: 'Ошибка восстановления из iCloud'
			}
		}
	},
	ai: {
		header: 'AI-функции',
		footer: 'Подсказки в формах бесплатны. Остальные AI-функции требуют Unlimited.',
		status: 'Статус устройства',
		toggle: 'AI на устройстве',
		supported: 'Доступен',
		not_supported: 'Недоступен'
	},
	tip_jar: {
		header: 'Банка с чаевыми',
		thanks: 'Спасибо за поддержку!',
		error: 'Произошла неизвестная ошибка при обработке чаевых.',

		products: {
			small_fry: 'Мелкая рыбёшка',
			good_catch: 'Хороший улов',
			big_fish: 'Крупная рыба',
			whale: 'Кит'
		}
	}
};

const libraryScreen: LocaleRootT['library'] = {};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Итого',
		no_txs: 'Нет транзакций'
	},
	analytics: {
		other_categories: 'Другие категории'
	},
	details: {
		category: 'Категория',
		currency: 'Валюта',
		payment: 'Способ оплаты',
		notes: 'Заметки',
		notes_placeholder: 'Нажми, чтобы добавить комментарий'
	},
	filters: {
		title: 'Фильтры',
		clear: 'Сбросить',
		search: 'Поиск',
		empty: 'Нет доступных фильтров',
		tabs: {
			category: 'Категория',
			service: 'Сервис',
			tender: 'Оплата',
			currency: 'Валюта'
		}
	},
	time_mode: {
		future: 'Предстоящие',
		all: 'За всё время'
	},
	view_mode: {
		subscriptions: 'Подписки'
	}
};

const defaultCategories: LocaleRootT['category'] = {
	ai: 'AI',
	automotive: 'Авто',
	beauty_care: 'Красота и уход',
	bundles: 'Бандлы',
	cloud_storage: 'Облачное хранилище',
	creator_platforms: 'Площадки для авторов',
	datings: 'Знакомства',
	design_and_creative: 'Дизайн и креатив',
	developer_tools: 'Инструменты разработчика',
	domains_and_dns: 'Доменные регистраторы',
	education: 'Образование',
	finances_and_insurance: 'Финансы и страхование',
	food_and_delivery: 'Еда и доставка',
	gaming: 'Игры',
	health_and_fitness: 'Здоровье и фитнес',
	hosting_and_vps: 'Хостинг и VPS',
	marketing: 'Маркетинг',
	music_and_audiobooks: 'Музыка и аудиокниги',
	news_and_reading: 'Новости и чтение',
	paas_and_deployment: 'PaaS',
	pets: 'Зоотовары',
	productivity: 'Продуктивность',
	shopping_and_memberships: 'Покупки и членства',
	smart_home_and_iot: 'Умный дом / IoT',
	social: 'Соцсети',
	transportation: 'Транспорт',
	travel_and_flights: 'Путешествия',
	utilities_and_bills: 'Коммуналка и счета',
	vpn_and_security: 'VPN и безопасность',
	video_streaming: 'Видеостриминг'
};

const russian: LocaleRootT = {
	tokens: { regions, countries, currencies, languages },
	ios: {
		CFBundleDisplayName: 'Uha'
	},
	dates: {
		today: 'Сегодня',
		tomorrow: 'Завтра',
		yesterday: 'Вчера',
		day: 'День',
		month: 'Месяц',
		year: 'Год',
		in_month: 'В {{month}}',
		in_year: 'В {{year}}'
	},
	rates: {
		error: {
			title: 'Ошибка обновления курсов',
			description: 'Конвертация валют может быть неточной'
		},
		success: {
			title: 'Курсы обновлены'
		}
	},
	category: defaultCategories,

	navbar: {
		transactions: {
			title: 'Главная',
			go_to_today: 'К сегодня',
			view_list: 'Список',
			view_calendar: 'Календарь',
			open_filters: 'Фильтры'
		},
		library: {
			title: 'Библиотека',
			categories: 'Категории',
			services: 'Сервисы',
			payments: 'Платежи',
			subscriptions: 'Подписки'
		},
		settings: {
			title: 'Настройки',
			refresh_rates: 'Обновить курсы'
		},
		add: {
			title: 'Новое',
			service: 'Новый сервис',
			category: 'Новая категория',
			payment: 'Новый платёж',
			subscription: 'Новая подписка'
		}
	},

	transactions: transactionsScreen,
	library: libraryScreen,
	settings: settingsScreen,

	crossroad: {
		no_results: 'Ничего не найдено',
		grid: {
			category: {
				title: 'Категория',
				description: 'Группировка сервисов'
			},
			service: {
				title: 'Сервис',
				description: 'Приложение или сервис'
			},
			payment: {
				title: 'Метод оплаты',
				description: 'Карта или другой способ оплаты'
			},
			subscription: {
				title: 'Подписки',
				description: 'Создать подписку с нуля'
			}
		},
		add: {
			header: 'Найти сервис',
			search_bar: 'Поиск сервиса',
			search_results: 'Результаты поиска',
			sections: {
				top_hit: 'Лучшее совпадение',
				verified: 'Проверенные',
				external: 'Внешние'
			}
		}
	}
};

export default russian;
