import type { LocaleRootT } from './locales.d';

const i18nLanguages: LocaleRootT['languages'] = {
	en: 'Inglés',
	ru: 'Ruso',
	kk: 'Kazajo',
	es: 'Español',
	ja: 'Japonés'
};

const settingsScreen: LocaleRootT['settings'] = {
	system: {
		notifications: {
			header: 'Notificaciones',
			results: {
				denied: 'No solicitado',
				blocked: 'Desactivado',
				granted: 'Activado',
				limited: 'Activado'
			}
		},
		language: 'Idioma'
	},
	appearance: {
		header: 'Apariencia',
		light: 'Claro',
		dark: 'Oscuro',
		oled: 'OLED'
	},
	preferences: {
		header: 'Preferencias',
		first_day: 'Primer día de la semana',
		max_horizon: 'Horizonte máximo',
		years_unit: 'a.',
		day_hint_us: 'Estilo EE.UU.',
		day_hint_iso: 'Internacional'
	},
	general: {
		header: 'Sistema'
	},
	currencies: {
		header: 'Monedas',
		default_currency_code: 'Moneda principal',
		recalc_currency_code: 'Moneda de conversión',
		refresh_rates: 'Tasas de cambio',
		search: 'Buscar monedas',
		primary: 'Principal',

		// target/region
		europe: 'Europa',
		north_america: 'Norteamérica',
		central_america: 'Centroamérica',
		south_america: 'Sudamérica',
		caribbean: 'Caribe',
		central_asia: 'Asia Central',
		south_asia: 'Asia del Sur',
		east_asia: 'Asia Oriental',
		southeast_asia: 'Sudeste Asiático',
		oceania: 'Oceanía',
		africa: 'África',
		cryptocurrency: 'Criptomonedas',
		other: 'Otras'
	},
	about: {
		sources: 'Fuentes',
		beta: 'Unirse a la Beta',
		version: 'Versión'
	},
	donations: {
		header: 'Apóyame',
		description: 'Uha está hecho por un desarrollador indie. Tu apoyo ayuda a mantenerlo vivo y mejorando.',

		// unit.type
		patreon: 'Patreon',
		github: 'GitHub',
		boosty: 'Boosty'
	},
	unlimited: {
		badge: 'Unlimited',
		active: 'Todas las funciones desbloqueadas',
		upgrade: 'Desbloquear todo'
	},
	data: {
		header: 'Datos',
		cancel: 'Cancelar',
		data_footer: 'Restaurar cualquier copia de seguridad sobrescribirá todos los datos existentes.',

		db: {
			backup: {
				title: 'Copia de seguridad',
				success: 'Copia creada',
				error: 'Error en la copia'
			},
			restore: {
				title: 'Restaurar',
				success: 'Datos restaurados',
				error: 'Error al restaurar'
			}
		},

		csv: {
			export: {
				title: 'Exportar a CSV',
				success: 'Exportación lista',
				error: 'Error en la exportación'
			},
			import: {
				title: 'Restaurar desde CSV',
				success: 'Datos importados',
				error: 'Error al importar'
			}
		},

		icloud: {
			sync: 'Sincronización iCloud',

			statuses: {
				checking: 'Verificando...',
				unavailable: 'Inicia sesión en iCloud',
				backing_up: 'Respaldando...',
				restoring: 'Restaurando...',
				no_backup: 'Sin copia aún'
			},

			backup: {
				title: 'Respaldar en iCloud',
				success: 'Respaldado en iCloud',
				error: 'Error en respaldo iCloud'
			},

			restore: {
				title: 'Restaurar de iCloud',
				success: 'Restaurado de iCloud',
				error: 'Error al restaurar de iCloud'
			}
		}
	},
	ai: {
		header: 'Funciones IA',
		footer: 'Las sugerencias son gratuitas. Otras funciones IA requieren Unlimited.',
		status: 'Estado del dispositivo',
		toggle: 'IA en dispositivo',
		supported: 'Disponible',
		not_supported: 'No disponible'
	},
	tip_jar: {
		header: 'Propinas',
		thanks: '¡Gracias por tu apoyo!',
		error: 'Ocurrió un error desconocido al procesar tu propina.',

		products: {
			small_fry: 'Pez pequeño',
			good_catch: 'Buena pesca',
			big_fish: 'Pez gordo',
			whale: 'Ballena'
		}
	}
};

const libraryScreen: LocaleRootT['library'] = {
	search: {
		all: 'Buscar en todo',
		categories: 'Buscar en categorías',
		services: 'Buscar en servicios',
		payments: 'Buscar en pagos'
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Total',
		no_txs: 'Sin transacciones'
	},
	details: {
		category: 'Categoría',
		currency: 'Moneda',
		payment: 'Método de pago',
		notes: 'Notas',
		notes_placeholder: 'Toca para agregar un comentario'
	},
	filters: {
		title: 'Filtros',
		clear: 'Limpiar',
		search: 'Buscar',
		empty: 'No hay filtros disponibles',
		tabs: {
			category: 'Categoría',
			service: 'Servicio',
			tender: 'Medio',
			currency: 'Moneda'
		}
	},
	time_mode: {
		future: 'Próximos',
		all: 'Todo el tiempo'
	},
	view_mode: {
		subscriptions: 'Suscripciones'
	}
};

const currenciesList: LocaleRootT['currencies'] = {
	AOA: 'Kwanza angoleño',
	BWP: 'Pula botsuanesa',
	BIF: 'Franco burundés',
	CDF: 'Franco congoleño',
	CVE: 'Escudo caboverdiano',
	ETB: 'Birr etíope',
	GHS: 'Cedi ghanés',
	KES: 'Chelín keniano',
	LRD: 'Dólar liberiano',
	LSL: 'Loti lesotense',
	MUR: 'Rupia mauriciana',
	MWK: 'Kwacha malauí',
	MZN: 'Metical mozambiqueño',
	NAD: 'Dólar namibio',
	NGN: 'Naira nigeriana',
	RWF: 'Franco ruandés',
	SCR: 'Rupia seychelense',
	SZL: 'Lilangeni suazi',
	TZS: 'Chelín tanzano',
	UGX: 'Chelín ugandés',
	XAF: 'Franco CFA de África Central',
	XOF: 'Franco CFA de África Occidental',
	ZAR: 'Rand sudafricano',
	ZMW: 'Kwacha zambiano',
	ALL: 'Lek albanés',
	BAM: 'Marco convertible',
	BGN: 'Lev búlgaro',
	CHF: 'Franco suizo',
	CZK: 'Corona checa',
	DKK: 'Corona danesa',
	EUR: 'Euro',
	GBP: 'Libra esterlina',
	GEL: 'Lari georgiano',
	GIP: 'Libra gibraltareña',
	HRK: 'Kuna croata',
	HUF: 'Forinto húngaro',
	ILS: 'Shekel israelí',
	ISK: 'Corona islandesa',
	MDL: 'Leu moldavo',
	MKD: 'Denar macedonio',
	NOK: 'Corona noruega',
	PLN: 'Zloty polaco',
	RON: 'Leu rumano',
	RSD: 'Dinar serbio',
	RUB: 'Rublo ruso',
	SEK: 'Corona sueca',
	TRY: 'Lira turca',
	UAH: 'Grivna ucraniana',
	CAD: 'Dólar canadiense',
	MXN: 'Peso mexicano',
	USD: 'Dólar estadounidense',
	BZD: 'Dólar beliceño',
	CRC: 'Colón costarricense',
	GTQ: 'Quetzal guatemalteco',
	HNL: 'Lempira hondureña',
	NIO: 'Córdoba nicaragüense',
	PAB: 'Balboa panameño',
	SVC: 'Colón salvadoreño',
	ARS: 'Peso argentino',
	BOB: 'Boliviano',
	BRL: 'Real brasileño',
	CLP: 'Peso chileno',
	COP: 'Peso colombiano',
	GYD: 'Dólar guyanés',
	PEN: 'Sol peruano',
	PYG: 'Guaraní paraguayo',
	SRD: 'Dólar surinamés',
	UYU: 'Peso uruguayo',
	AWG: 'Florín arubeño',
	BBD: 'Dólar barbadense',
	BMD: 'Dólar bermudeño',
	BSD: 'Dólar bahameño',
	CUC: 'Peso cubano convertible',
	CUP: 'Peso cubano',
	DOP: 'Peso dominicano',
	HTG: 'Gourde haitiano',
	JMD: 'Dólar jamaicano',
	KYD: 'Dólar de las Islas Caimán',
	TTD: 'Dólar trinitense',
	XCD: 'Dólar del Caribe Oriental',
	AMD: 'Dram armenio',
	AZN: 'Manat azerbaiyano',
	KGS: 'Som kirguís',
	KZT: 'Tenge',
	TJS: 'Somoni tayiko',
	UZS: 'Som uzbeko',
	INR: 'Rupia india',
	LKR: 'Rupia esrilanquesa',
	NPR: 'Rupia nepalí',
	CNH: 'Yuan chino (offshore)',
	CNY: 'Yuan chino',
	HKD: 'Dólar de Hong Kong',
	JPY: 'Yen japonés',
	KRW: 'Won surcoreano',
	MOP: 'Pataca macaense',
	TWD: 'Nuevo dólar taiwanés',
	KHR: 'Riel camboyano',
	LAK: 'Kip laosiano',
	MMK: 'Kyat birmano',
	PHP: 'Peso filipino',
	SGD: 'Dólar singapurense',
	THB: 'Baht tailandés',
	VND: 'Dong vietnamita',
	AUD: 'Dólar australiano',
	FJD: 'Dólar fiyiano',
	NZD: 'Dólar neozelandés',
	PGK: 'Kina papuana',
	SBD: 'Dólar salomonense',
	TOP: 'Paʻanga tongano',
	BCH: 'Bitcoin Cash',
	BTC: 'Bitcoin',
	BTG: 'Bitcoin Gold',
	DASH: 'Dash',
	EOS: 'EOS',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	XLM: 'Stellar Lumens',
	XRP: 'Ripple',
	AED: 'Dírham de los EAU',
	OMR: 'Rial omaní',
	BDT: 'Taka bangladesí',
	IDR: 'Rupia indonesia',
	MYR: 'Ringgit malayo',
	EGP: 'Libra egipcia',
	MVR: 'Rufiyaa maldiva'
};

const defaultCategories: LocaleRootT['default_categories'] = {
	ai: 'IA',
	automotive: 'Automotriz',
	beauty_care: 'Belleza y cuidado',
	bundles: 'Paquetes',
	cloud_storage: 'Almacenamiento en la nube',
	creator_platforms: 'Plataformas para creadores',
	datings: 'Citas',
	design_and_creative: 'Diseño y creatividad',
	developer_tools: 'Herramientas de desarrollo',
	domains_and_dns: 'Dominios y DNS',
	education: 'Educación',
	finances_and_insurance: 'Finanzas y seguros',
	food_and_delivery: 'Comida y delivery',
	gaming: 'Videojuegos',
	health_and_fitness: 'Salud y fitness',
	hosting_and_vps: 'Hosting y VPS',
	marketing: 'Marketing',
	music_and_audiobooks: 'Música y audiolibros',
	news_and_reading: 'Noticias y lectura',
	paas_and_deployment: 'PaaS y despliegue',
	pets: 'Mascotas',
	productivity: 'Productividad',
	shopping_and_memberships: 'Compras y membresías',
	smart_home_and_iot: 'Hogar inteligente e IoT',
	social: 'Redes sociales',
	transportation: 'Transporte',
	travel_and_flights: 'Viajes y vuelos',
	utilities_and_bills: 'Servicios y facturas',
	vpn_and_security: 'VPN y seguridad',
	video_streaming: 'Streaming de video'
};

const spanish: LocaleRootT = {
	ios: {
		CFBundleDisplayName: 'Uha'
	},
	dates: {
		today: 'Hoy',
		tomorrow: 'Mañana',
		yesterday: 'Ayer',
		day: 'Día',
		month: 'Mes',
		year: 'Año',
		in_month: 'En {{month}}',
		in_year: 'En {{year}}'
	},
	rates: {
		error: {
			title: 'Error al actualizar tasas',
			description: 'Las conversiones pueden ser inexactas'
		},
		success: {
			title: 'Tasas actualizadas'
		}
	},
	languages: i18nLanguages,
	default_categories: defaultCategories,
	currencies: currenciesList,

	navbar: {
		transactions: {
			title: 'Inicio',
			go_to_today: 'Ir a hoy',
			view_list: 'Vista de lista',
			view_calendar: 'Vista calendario',
			open_filters: 'Filtros'
		},
		library: {
			title: 'Biblioteca',
			categories: 'Categorías',
			services: 'Servicios',
			payments: 'Pagos'
		},
		settings: {
			title: 'Ajustes',
			refresh_rates: 'Actualizar tasas'
		},
		add: {
			title: 'Nuevo',
			service: 'Nuevo servicio',
			category: 'Nueva categoría',
			payment: 'Nuevo pago',
			subscription: 'Nueva suscripción'
		}
	},

	transactions: transactionsScreen,
	library: libraryScreen,
	settings: settingsScreen
};

export default spanish;
