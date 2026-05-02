import type { LocaleRootT, RegionsT, CurrencyCode, LanguageCode, CountriesList } from './locales.d';

// Tokens
const regions: RegionsT = {
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
	other: 'Otras',
	cryptocurrency: 'Criptomonedas'
};
const countries: Record<CountriesList, string> = {
	AF: 'Afganistán',
	AL: 'Albania',
	DZ: 'Argelia',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguila',
	AG: 'Antigua y Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaiyán',
	BS: 'Bahamas',
	BH: 'Baréin',
	BD: 'Bangladés',
	BB: 'Barbados',
	BY: 'Bielorrusia',
	BE: 'Bélgica',
	BZ: 'Belice',
	BJ: 'Benín',
	BM: 'Bermudas',
	BT: 'Bután',
	BO: 'Bolivia',
	BA: 'Bosnia y Herzegovina',
	BW: 'Botsuana',
	BR: 'Brasil',
	BN: 'Brunéi',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	CV: 'Cabo Verde',
	KH: 'Camboya',
	CM: 'Camerún',
	CA: 'Canadá',
	KY: 'Islas Caimán',
	CF: 'República Centroafricana',
	TD: 'Chad',
	CL: 'Chile',
	CN: 'China',
	CO: 'Colombia',
	CD: 'Congo (RD)',
	CG: 'Congo',
	CR: 'Costa Rica',
	HR: 'Croacia',
	CY: 'Chipre',
	CZ: 'Chequia',
	CI: 'Costa de Marfil',
	DK: 'Dinamarca',
	DM: 'Dominica',
	DO: 'República Dominicana',
	EC: 'Ecuador',
	EG: 'Egipto',
	SV: 'El Salvador',
	EE: 'Estonia',
	SZ: 'Esuatini',
	ET: 'Etiopía',
	FJ: 'Fiyi',
	FI: 'Finlandia',
	FR: 'Francia',
	GA: 'Gabón',
	GM: 'Gambia',
	GE: 'Georgia',
	DE: 'Alemania',
	GH: 'Ghana',
	GR: 'Grecia',
	GD: 'Granada',
	GT: 'Guatemala',
	GN: 'Guinea',
	GW: 'Guinea-Bisáu',
	GY: 'Guyana',
	HN: 'Honduras',
	HK: 'Hong Kong',
	HU: 'Hungría',
	IS: 'Islandia',
	IN: 'India',
	ID: 'Indonesia',
	IQ: 'Irak',
	IE: 'Irlanda',
	IL: 'Israel',
	IT: 'Italia',
	JM: 'Jamaica',
	JP: 'Japón',
	JO: 'Jordania',
	KZ: 'Kazajistán',
	KE: 'Kenia',
	KR: 'Corea',
	KW: 'Kuwait',
	KG: 'Kirguistán',
	LA: 'Laos',
	LV: 'Letonia',
	LB: 'Líbano',
	LR: 'Liberia',
	LY: 'Libia',
	LI: 'Liechtenstein',
	LT: 'Lituania',
	LU: 'Luxemburgo',
	MO: 'Macao',
	MG: 'Madagascar',
	MW: 'Malaui',
	MY: 'Malasia',
	MV: 'Maldivas',
	ML: 'Malí',
	MT: 'Malta',
	MR: 'Mauritania',
	MU: 'Mauricio',
	MX: 'México',
	FM: 'Micronesia',
	MD: 'Moldavia',
	MC: 'Mónaco',
	MN: 'Mongolia',
	ME: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Marruecos',
	MZ: 'Mozambique',
	MM: 'Birmania',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Países Bajos',
	NZ: 'Nueva Zelanda',
	NI: 'Nicaragua',
	NE: 'Níger',
	NG: 'Nigeria',
	MK: 'Macedonia del Norte',
	NO: 'Noruega',
	OM: 'Omán',
	PK: 'Pakistán',
	PW: 'Palaos',
	PA: 'Panamá',
	PG: 'Papúa Nueva Guinea',
	PY: 'Paraguay',
	PE: 'Perú',
	PH: 'Filipinas',
	PL: 'Polonia',
	PT: 'Portugal',
	PS: 'Palestina',
	QA: 'Catar',
	RO: 'Rumanía',
	RU: 'Rusia',
	RW: 'Ruanda',
	KN: 'San Cristóbal y Nieves',
	LC: 'Santa Lucía',
	VC: 'San Vicente y las Granadinas',
	WS: 'Samoa',
	ST: 'Santo Tomé y Príncipe',
	SA: 'Arabia Saudita',
	SN: 'Senegal',
	RS: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leona',
	SG: 'Singapur',
	SK: 'Eslovaquia',
	SI: 'Eslovenia',
	SB: 'Islas Salomón',
	ZA: 'Sudáfrica',
	ES: 'España',
	LK: 'Sri Lanka',
	SR: 'Surinam',
	SE: 'Suecia',
	CH: 'Suiza',
	TW: 'Taiwán',
	TJ: 'Tayikistán',
	TZ: 'Tanzania',
	TH: 'Tailandia',
	TO: 'Tonga',
	TT: 'Trinidad y Tobago',
	TN: 'Túnez',
	TR: 'Turquía',
	TM: 'Turkmenistán',
	TC: 'Islas Turcas y Caicos',
	UG: 'Uganda',
	UA: 'Ucrania',
	AE: 'Emiratos Árabes Unidos',
	GB: 'Reino Unido',
	US: 'Estados Unidos',
	UY: 'Uruguay',
	UZ: 'Uzbekistán',
	VU: 'Vanuatu',
	VE: 'Venezuela',
	VN: 'Vietnam',
	VG: 'Islas Vírgenes Británicas',
	XK: 'Kosovo',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabue'
};
const languages: Record<LanguageCode, string> = {
	en: 'Inglés',
	ru: 'Ruso',
	kk: 'Kazajo',
	es: 'Español',
	ja: 'Japonés',
	de: 'Alemán',
	fr: 'Francés',
	it: 'Italiano',
	pt: 'Portugués',
	nl: 'Neerlandés',
	pl: 'Polaco',
	cs: 'Checo',
	hu: 'Húngaro',
	ro: 'Rumano',
	uk: 'Ucraniano',
	tr: 'Turco',
	ar: 'Árabe',
	he: 'Hebreo',
	ko: 'Coreano',
	zh: 'Chino',
	th: 'Tailandés',
	vi: 'Vietnamita',
	id: 'Indonesio',
	ms: 'Malayo',
	hi: 'Hindi',
	sv: 'Sueco',
	da: 'Danés',
	nb: 'Noruego',
	fi: 'Finlandés'
};
const currencies: Record<CurrencyCode, string> = {
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

// Screens
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
		default_currency: 'Moneda principal',
		recalc_currency: 'Moneda de conversión',
		refresh_rates: 'Tasas de cambio',
		search: 'Buscar monedas',
		primary: 'Principal'
	},
	sources: {
		header: 'Fuentes de búsqueda',
		search: 'Buscar',
		primary: 'Principal',
		language: 'Idioma',
		inhouse: 'API de Uha',
		inhouse_desc: 'Nuestra propia base de datos seleccionada de marcas y suscripciones',
		appstore: 'App Store',
		playstore: 'Google Play',
		web: 'Web',
		brandfetch: 'Brandfetch',
		logo_dev: 'logo.dev'
	},
	about: {
		bug: 'Reportar un bug',
		website: 'uha.app',
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
		boosty: 'Boosty',
		ko_fi: 'Ko-fi'
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
	title: 'Biblioteca',
	grid: {
		categories: {
			title: 'Categorías',
			description: 'Ver y editar grupos'
		},
		services: {
			title: 'Servicios',
			description: 'Ver y editar proveedores'
		},
		payments: {
			title: 'Métodos de pago',
			description: 'Tarjetas y billeteras u otros métodos'
		},
		subscriptions: {
			title: 'Suscripciones',
			description: 'Ver y editar planes activos'
		}
	},
	delete_blocked: {
		default_category: 'No se puede eliminar la categoría del sistema',
		title: 'No se puede eliminar',
		category_one: 'En uso por 1 suscripción',
		category_other: 'En uso por {{count}} suscripciones',
		service_one: 'En uso por 1 suscripción',
		service_other: 'En uso por {{count}} suscripciones',
		payment_one: 'En uso por 1 suscripción',
		payment_other: 'En uso por {{count}} suscripciones'
	},
	details: {
		save: 'Guardar',
		copy: 'Copiar',
		copied: 'Copiado',
		id_copied: 'ID copiado',
		section: {
			identity: 'Identidad',
			appearance: 'Apariencia',
			other: 'Otros',
			aliases: 'Alias'
		},
		aliases: {
			add: 'Añadir alias…'
		},
		fields: {
			slug: 'Slug',
			id: 'ID',
			title: 'Título personalizado',
			emoji: 'Emoji',
			color: 'Color',
			comment: 'Comentario',
			card: 'Tarjeta',
			category: 'Categoría',
			symbol: 'Símbolo SF',
			logo_url: 'URL del logo',
			bundle_id: 'ID del paquete',
			ref_link: 'Enlace de referido'
		}
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: 'Total',
		no_txs: 'Sin transacciones'
	},
	analytics: {
		other_categories: 'Otras categorías'
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
	},
	refresh_success: {
		title: 'Transacciones sincronizadas',
		description: 'Entradas pasadas y futuras actualizadas'
	}
};

const defaultCategories: LocaleRootT['category'] = {
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
	tokens: { regions, countries, currencies, languages },
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
		in_year: 'En {{year}}',
		in_months: {
			0: 'En enero',
			1: 'En febrero',
			2: 'En marzo',
			3: 'En abril',
			4: 'En mayo',
			5: 'En junio',
			6: 'En julio',
			7: 'En agosto',
			8: 'En septiembre',
			9: 'En octubre',
			10: 'En noviembre',
			11: 'En diciembre'
		}
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
	category: defaultCategories,

	notifications: {
		title: 'Recordatorio de suscripción',
		subscription: {
			today: 'El pago de tu suscripción vence hoy.',
			in_days: 'El pago de tu suscripción vence en {{count}} días.'
		},
		trial: {
			today: 'El periodo de prueba de tu suscripción termina hoy.',
			in_days: 'El periodo de prueba de tu suscripción termina en {{count}} días.'
		}
	},

	navbar: {
		transactions: {
			title: 'Inicio',
			go_to_today: 'Ir a hoy',
			view_list: 'Vista de lista',
			view_calendar: 'Vista calendario',
			open_filters: 'Filtros'
		},
		library: {
			root: 'Raíz',
			title: 'Biblioteca',
			categories: 'Categorías',
			services: 'Servicios',
			payments: 'Pagos',
			subscriptions: 'Suscripciones'
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
	settings: settingsScreen,

	crossroad: {
		title: 'Nueva entrada',
		no_results: 'No se encontró nada',
		grid: {
			category: {
				title: 'Categoría',
				description: 'Agrupar servicios por tipo'
			},
			service: {
				title: 'Servicio',
				description: 'Aplicación o servicio'
			},
			payment: {
				title: 'Método de pago',
				description: 'Tarjeta u otro método de pago'
			},
			subscription: {
				title: 'Suscripciones',
				description: 'Crear una suscripción desde cero'
			}
		},
		add: {
			header: 'Buscar servicio',
			search_bar: 'Buscar servicio',
			search_results: 'Resultados',
			sections: {
				top_hit: 'Mejor resultado',
				verified: 'Verificados',
				external: 'Externos'
			}
		}
	}
};

export default spanish;
