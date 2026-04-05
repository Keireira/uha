import type { LocaleRootT } from './locales.d';

const i18nLanguages: LocaleRootT['languages'] = {
	en: 'Английский',
	ru: 'Русский',
	kk: 'Казахский',
	es: 'Испанский',
	ja: 'Японский'
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
		first_day: 'Первый день недели',
		max_horizon: 'Макс. горизонт',
		years_unit: 'г.',
		day_hint_us: 'Американский',
		day_hint_iso: 'Международный'
	},
	general: {
		header: 'Система'
	},
	currencies: {
		header: 'Валюты',
		default_currency_code: 'Основная валюта',
		recalc_currency_code: 'Валюта пересчёта',
		refresh_rates: 'Курсы валют',
		search: 'Поиск валют',
		primary: 'Основные',

		// target/region
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
		cryptocurrency: 'Криптовалюты',
		other: 'Другие'
	},
	about: {
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
		boosty: 'Boosty'
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

const libraryScreen: LocaleRootT['library'] = {
	search: {
		all: 'Искать везде',
		categories: 'Искать в категориях',
		services: 'Искать в сервисах',
		payments: 'Искать в платежах'
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Итого',
		no_txs: 'Нет транзакций'
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

const currenciesList: LocaleRootT['currencies'] = {
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
	HRK: 'Хорватская куна',
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
	CUC: 'Кубинское конвертируемое песо',
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
	languages: i18nLanguages,
	category: defaultCategories,
	currencies: currenciesList,

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
			payments: 'Платежи'
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
				description: 'К сожалению (◞‸◟)'
			}
		},
		add: {
			header: 'Найти сервис',
			search_bar: 'Поиск сервиса',
			no_results: 'Ничего не найдено',
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
