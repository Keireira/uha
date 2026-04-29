import type { LocaleRootT, RegionsT, CurrencyCode, LanguageCode, CountriesList } from './locales.d';

const regions: RegionsT = {
	europe: 'ヨーロッパ',
	north_america: '北米',
	central_america: '中米',
	south_america: '南米',
	caribbean: 'カリブ',
	central_asia: '中央アジア',
	south_asia: '南アジア',
	east_asia: '東アジア',
	southeast_asia: '東南アジア',
	oceania: 'オセアニア',
	africa: 'アフリカ',
	other: 'その他',
	cryptocurrency: '暗号通貨'
};
const countries: Record<CountriesList, string> = {
	AF: 'アフガニスタン',
	AL: 'アルバニア',
	DZ: 'アルジェリア',
	AD: 'アンドラ',
	AO: 'アンゴラ',
	AI: 'アンギラ',
	AG: 'アンティグア・バーブーダ',
	AR: 'アルゼンチン',
	AM: 'アルメニア',
	AU: 'オーストラリア',
	AT: 'オーストリア',
	AZ: 'アゼルバイジャン',
	BS: 'バハマ',
	BH: 'バーレーン',
	BD: 'バングラデシュ',
	BB: 'バルバドス',
	BY: 'ベラルーシ',
	BE: 'ベルギー',
	BZ: 'ベリーズ',
	BJ: 'ベナン',
	BM: 'バミューダ',
	BT: 'ブータン',
	BO: 'ボリビア',
	BA: 'ボスニア・ヘルツェゴビナ',
	BW: 'ボツワナ',
	BR: 'ブラジル',
	BN: 'ブルネイ',
	BG: 'ブルガリア',
	BF: 'ブルキナファソ',
	CV: 'カーボベルデ',
	KH: 'カンボジア',
	CM: 'カメルーン',
	CA: 'カナダ',
	KY: 'ケイマン諸島',
	CF: '中央アフリカ共和国',
	TD: 'チャド',
	CL: 'チリ',
	CN: '中国',
	CO: 'コロンビア',
	CD: 'コンゴ民主共和国',
	CG: 'コンゴ',
	CR: 'コスタリカ',
	HR: 'クロアチア',
	CY: 'キプロス',
	CZ: 'チェコ',
	CI: 'コートジボワール',
	DK: 'デンマーク',
	DM: 'ドミニカ国',
	DO: 'ドミニカ共和国',
	EC: 'エクアドル',
	EG: 'エジプト',
	SV: 'エルサルバドル',
	EE: 'エストニア',
	SZ: 'エスワティニ',
	ET: 'エチオピア',
	FJ: 'フィジー',
	FI: 'フィンランド',
	FR: 'フランス',
	GA: 'ガボン',
	GM: 'ガンビア',
	GE: 'ジョージア',
	DE: 'ドイツ',
	GH: 'ガーナ',
	GR: 'ギリシャ',
	GD: 'グレナダ',
	GT: 'グアテマラ',
	GN: 'ギニア',
	GW: 'ギニアビサウ',
	GY: 'ガイアナ',
	HN: 'ホンジュラス',
	HK: '香港',
	HU: 'ハンガリー',
	IS: 'アイスランド',
	IN: 'インド',
	ID: 'インドネシア',
	IQ: 'イラク',
	IE: 'アイルランド',
	IL: 'イスラエル',
	IT: 'イタリア',
	JM: 'ジャマイカ',
	JP: '日本',
	JO: 'ヨルダン',
	KZ: 'カザフスタン',
	KE: 'ケニア',
	KR: '韓国',
	KW: 'クウェート',
	KG: 'キルギス',
	LA: 'ラオス',
	LV: 'ラトビア',
	LB: 'レバノン',
	LR: 'リベリア',
	LY: 'リビア',
	LI: 'リヒテンシュタイン',
	LT: 'リトアニア',
	LU: 'ルクセンブルク',
	MO: 'マカオ',
	MG: 'マダガスカル',
	MW: 'マラウイ',
	MY: 'マレーシア',
	MV: 'モルディブ',
	ML: 'マリ',
	MT: 'マルタ',
	MR: 'モーリタニア',
	MU: 'モーリシャス',
	MX: 'メキシコ',
	FM: 'ミクロネシア',
	MD: 'モルドバ',
	MC: 'モナコ',
	MN: 'モンゴル',
	ME: 'モンテネグロ',
	MS: 'モントセラト',
	MA: 'モロッコ',
	MZ: 'モザンビーク',
	MM: 'ミャンマー',
	NA: 'ナミビア',
	NR: 'ナウル',
	NP: 'ネパール',
	NL: 'オランダ',
	NZ: 'ニュージーランド',
	NI: 'ニカラグア',
	NE: 'ニジェール',
	NG: 'ナイジェリア',
	MK: '北マケドニア',
	NO: 'ノルウェー',
	OM: 'オマーン',
	PK: 'パキスタン',
	PW: 'パラオ',
	PA: 'パナマ',
	PG: 'パプアニューギニア',
	PY: 'パラグアイ',
	PE: 'ペルー',
	PH: 'フィリピン',
	PL: 'ポーランド',
	PT: 'ポルトガル',
	PS: 'パレスチナ',
	QA: 'カタール',
	RO: 'ルーマニア',
	RU: 'ロシア',
	RW: 'ルワンダ',
	KN: 'セントクリストファー・ネイビス',
	LC: 'セントルシア',
	VC: 'セントビンセント・グレナディーン',
	WS: 'サモア',
	ST: 'サントメ・プリンシペ',
	SA: 'サウジアラビア',
	SN: 'セネガル',
	RS: 'セルビア',
	SC: 'セーシェル',
	SL: 'シエラレオネ',
	SG: 'シンガポール',
	SK: 'スロバキア',
	SI: 'スロベニア',
	SB: 'ソロモン諸島',
	ZA: '南アフリカ',
	ES: 'スペイン',
	LK: 'スリランカ',
	SR: 'スリナム',
	SE: 'スウェーデン',
	CH: 'スイス',
	TW: '台湾',
	TJ: 'タジキスタン',
	TZ: 'タンザニア',
	TH: 'タイ',
	TO: 'トンガ',
	TT: 'トリニダード・トバゴ',
	TN: 'チュニジア',
	TR: 'トルコ',
	TM: 'トルクメニスタン',
	TC: 'タークス・カイコス諸島',
	UG: 'ウガンダ',
	UA: 'ウクライナ',
	AE: 'アラブ首長国連邦',
	GB: 'イギリス',
	US: 'アメリカ合衆国',
	UY: 'ウルグアイ',
	UZ: 'ウズベキスタン',
	VU: 'バヌアツ',
	VE: 'ベネズエラ',
	VN: 'ベトナム',
	VG: 'イギリス領ヴァージン諸島',
	XK: 'コソボ',
	YE: 'イエメン',
	ZM: 'ザンビア',
	ZW: 'ジンバブエ'
};
const languages: Record<LanguageCode, string> = {
	en: '英語',
	ru: 'ロシア語',
	kk: 'カザフ語',
	es: 'スペイン語',
	ja: '日本語',
	de: 'ドイツ語',
	fr: 'フランス語',
	it: 'イタリア語',
	pt: 'ポルトガル語',
	nl: 'オランダ語',
	pl: 'ポーランド語',
	cs: 'チェコ語',
	hu: 'ハンガリー語',
	ro: 'ルーマニア語',
	uk: 'ウクライナ語',
	tr: 'トルコ語',
	ar: 'アラビア語',
	he: 'ヘブライ語',
	ko: '韓国語',
	zh: '中国語',
	th: 'タイ語',
	vi: 'ベトナム語',
	id: 'インドネシア語',
	ms: 'マレー語',
	hi: 'ヒンディー語',
	sv: 'スウェーデン語',
	da: 'デンマーク語',
	nb: 'ノルウェー語',
	fi: 'フィンランド語'
};
const currencies: Record<CurrencyCode, string> = {
	// Africa
	AOA: 'アンゴラ・クワンザ',
	BWP: 'ボツワナ・プラ',
	BIF: 'ブルンジ・フラン',
	CDF: 'コンゴ・フラン',
	CVE: 'カーボベルデ・エスクード',
	ETB: 'エチオピア・ブル',
	GHS: 'ガーナ・セディ',
	KES: 'ケニア・シリング',
	LRD: 'リベリア・ドル',
	LSL: 'レソト・ロチ',
	MUR: 'モーリシャス・ルピー',
	MWK: 'マラウイ・クワチャ',
	MZN: 'モザンビーク・メティカル',
	NAD: 'ナミビア・ドル',
	NGN: 'ナイジェリア・ナイラ',
	RWF: 'ルワンダ・フラン',
	SCR: 'セーシェル・ルピー',
	SZL: 'スワジランド・リランゲニ',
	TZS: 'タンザニア・シリング',
	UGX: 'ウガンダ・シリング',
	XAF: '中央アフリカCFAフラン',
	XOF: '西アフリカCFAフラン',
	ZAR: '南アフリカ・ランド',
	ZMW: 'ザンビア・クワチャ',

	// Europe
	ALL: 'アルバニア・レク',
	BAM: 'ボスニア兌換マルク',
	BGN: 'ブルガリア・レフ',
	CHF: 'スイス・フラン',
	CZK: 'チェコ・コルナ',
	DKK: 'デンマーク・クローネ',
	EUR: 'ユーロ',
	GBP: '英ポンド',
	GEL: 'ジョージア・ラリ',
	GIP: 'ジブラルタル・ポンド',
	HUF: 'ハンガリー・フォリント',
	ILS: 'イスラエル・シェケル',
	ISK: 'アイスランド・クローナ',
	MDL: 'モルドバ・レイ',
	MKD: 'マケドニア・デナール',
	NOK: 'ノルウェー・クローネ',
	PLN: 'ポーランド・ズウォティ',
	RON: 'ルーマニア・レイ',
	RSD: 'セルビア・ディナール',
	RUB: 'ロシア・ルーブル',
	SEK: 'スウェーデン・クローナ',
	TRY: 'トルコ・リラ',
	UAH: 'ウクライナ・フリヴニャ',

	// North America
	CAD: 'カナダ・ドル',
	MXN: 'メキシコ・ペソ',
	USD: '米ドル',

	// Central America
	BZD: 'ベリーズ・ドル',
	CRC: 'コスタリカ・コロン',
	GTQ: 'グアテマラ・ケツァル',
	HNL: 'ホンジュラス・レンピラ',
	NIO: 'ニカラグア・コルドバ',
	PAB: 'パナマ・バルボア',
	SVC: 'エルサルバドル・コロン',

	// South America
	ARS: 'アルゼンチン・ペソ',
	BOB: 'ボリビア・ボリビアーノ',
	BRL: 'ブラジル・レアル',
	CLP: 'チリ・ペソ',
	COP: 'コロンビア・ペソ',
	GYD: 'ガイアナ・ドル',
	PEN: 'ペルー・ソル',
	PYG: 'パラグアイ・グアラニー',
	SRD: 'スリナム・ドル',
	UYU: 'ウルグアイ・ペソ',

	// Caribbean
	AWG: 'アルバ・フロリン',
	BBD: 'バルバドス・ドル',
	BMD: 'バミューダ・ドル',
	BSD: 'バハマ・ドル',
	CUP: 'キューバ・ペソ',
	DOP: 'ドミニカ・ペソ',
	HTG: 'ハイチ・グールド',
	JMD: 'ジャマイカ・ドル',
	KYD: 'ケイマン諸島ドル',
	TTD: 'トリニダード・トバゴ・ドル',
	XCD: '東カリブ・ドル',

	// Central Asia
	AMD: 'アルメニア・ドラム',
	AZN: 'アゼルバイジャン・マナト',
	KGS: 'キルギス・ソム',
	KZT: 'テンゲ',
	TJS: 'タジキスタン・ソモニ',
	UZS: 'ウズベキスタン・スム',

	// South Asia
	INR: 'インド・ルピー',
	LKR: 'スリランカ・ルピー',
	NPR: 'ネパール・ルピー',

	// East Asia
	CNH: '中国人民元（オフショア）',
	CNY: '中国人民元',
	HKD: '香港ドル',
	JPY: '日本円',
	KRW: '韓国ウォン',
	MOP: 'マカオ・パタカ',
	TWD: '新台湾ドル',

	// Southeast Asia
	KHR: 'カンボジア・リエル',
	LAK: 'ラオス・キープ',
	MMK: 'ミャンマー・チャット',
	PHP: 'フィリピン・ペソ',
	SGD: 'シンガポール・ドル',
	THB: 'タイ・バーツ',
	VND: 'ベトナム・ドン',

	// Oceania
	AUD: 'オーストラリア・ドル',
	FJD: 'フィジー・ドル',
	NZD: 'ニュージーランド・ドル',
	PGK: 'パプアニューギニア・キナ',
	SBD: 'ソロモン諸島ドル',
	TOP: 'トンガ・パアンガ',

	// Cryptocurrency
	BCH: 'Bitcoin Cash',
	BTC: 'Bitcoin',
	BTG: 'Bitcoin Gold',
	DASH: 'Dash',
	EOS: 'EOS',
	ETH: 'Ethereum',
	LTC: 'Litecoin',
	XLM: 'Stellar Lumens',
	XRP: 'Ripple',

	// Other
	AED: 'UAEディルハム',
	OMR: 'オマーン・リアル',
	BDT: 'バングラデシュ・タカ',
	IDR: 'インドネシア・ルピア',
	MYR: 'マレーシア・リンギット',
	EGP: 'エジプト・ポンド',
	MVR: 'モルディブ・ルフィヤ'
};

const settingsScreen: LocaleRootT['settings'] = {
	system: {
		notifications: {
			header: '通知',
			results: {
				denied: '未リクエスト',
				blocked: '無効',
				granted: '有効',
				limited: '有効'
			}
		},
		language: '言語'
	},
	appearance: {
		header: '外観',
		light: 'ライト',
		dark: 'ダーク',
		oled: 'OLED'
	},
	preferences: {
		header: '設定',
		first_day: '週の始まり',
		max_horizon: '最大期間',
		years_unit: '年',
		day_hint_us: '米国式',
		day_hint_iso: '国際標準'
	},
	general: {
		header: 'システム'
	},
	currencies: {
		header: '通貨',
		default_currency: 'デフォルト通貨',
		recalc_currency: '換算通貨',
		refresh_rates: '為替レート',
		search: '通貨を検索',
		primary: '主要'
	},
	sources: {
		header: '検索ソース',
		footer: '認証済みの結果はこれらの設定に関係なく常に表示されます。',
		search: '検索',
		primary: 'プライマリ',
		language: '言語',
		appstore: 'App Store',
		playstore: 'Google Play',
		web: 'Web',
		brandfetch: 'Brandfetch',
		logo_dev: 'logo.dev'
	},
	about: {
		bug: 'バグを報告',
		website: 'uha.app',
		sources: 'ソース',
		beta: 'ベータに参加',
		version: 'バージョン'
	},
	donations: {
		header: 'サポート',
		description: 'Uhaは個人開発者が作っています。サポートが開発の継続と改善に繋がります。',

		// unit.type
		patreon: 'Patreon',
		github: 'GitHub',
		boosty: 'Boosty',
		ko_fi: 'Ko-fi'
	},
	unlimited: {
		badge: 'Unlimited',
		active: '全機能がアンロック済み',
		upgrade: '全機能をアンロック'
	},
	data: {
		header: 'データ',
		cancel: 'キャンセル',
		data_footer: 'バックアップを復元すると既存データがすべて上書きされます。',

		db: {
			backup: {
				title: 'バックアップ',
				success: 'バックアップ完了',
				error: 'バックアップ失敗'
			},
			restore: {
				title: '復元',
				success: 'データを復元しました',
				error: 'データの復元に失敗'
			}
		},

		csv: {
			export: {
				title: 'CSVにエクスポート',
				success: 'エクスポート完了',
				error: 'エクスポート失敗'
			},
			import: {
				title: 'CSVから復元',
				success: 'データをインポートしました',
				error: 'インポートに失敗'
			}
		},

		icloud: {
			sync: 'iCloud同期',

			statuses: {
				checking: '確認中...',
				unavailable: 'iCloudにサインイン',
				backing_up: 'バックアップ中...',
				restoring: '復元中...',
				no_backup: 'バックアップなし'
			},

			backup: {
				title: 'iCloudにバックアップ',
				success: 'iCloudにバックアップ完了',
				error: 'iCloudバックアップ失敗'
			},

			restore: {
				title: 'iCloudから復元',
				success: 'iCloudから復元完了',
				error: 'iCloud復元失敗'
			}
		}
	},
	ai: {
		header: 'AI機能',
		footer: 'フォーム候補は無料です。その他のAI機能にはUnlimitedが必要です。',
		status: 'デバイスの状態',
		toggle: 'オンデバイスAI',
		supported: '利用可能',
		not_supported: '利用不可'
	},
	tip_jar: {
		header: 'チップ',
		thanks: 'ご支援ありがとうございます！',
		error: 'チップの処理中に不明なエラーが発生しました。',

		products: {
			small_fry: '小魚',
			good_catch: '大漁',
			big_fish: '大物',
			whale: 'クジラ'
		}
	}
};

const libraryScreen: LocaleRootT['library'] = {
	search: {
		all: 'すべてを検索',
		categories: 'カテゴリで検索',
		services: 'サービスで検索',
		payments: '支払い方法で検索'
	}
};

const transactionsScreen: LocaleRootT['transactions'] = {
	calendar: {
		total: '合計',
		no_txs: '取引なし'
	},
	details: {
		category: 'カテゴリ',
		currency: '通貨',
		payment: '支払い方法',
		notes: 'メモ',
		notes_placeholder: 'タップしてコメントを追加'
	},
	filters: {
		title: 'フィルター',
		clear: 'クリア',
		search: '検索',
		empty: 'フィルターがありません',
		tabs: {
			category: 'カテゴリ',
			service: 'サービス',
			tender: '決済手段',
			currency: '通貨'
		}
	},
	time_mode: {
		future: '今後',
		all: 'すべての期間'
	},
	view_mode: {
		subscriptions: 'サブスクリプション'
	}
};

const defaultCategories: LocaleRootT['category'] = {
	ai: 'AI',
	automotive: '自動車',
	beauty_care: '美容・ケア',
	bundles: 'バンドル',
	cloud_storage: 'クラウドストレージ',
	creator_platforms: 'クリエイタープラットフォーム',
	datings: '出会い',
	design_and_creative: 'デザイン・クリエイティブ',
	developer_tools: '開発ツール',
	domains_and_dns: 'ドメイン・DNS',
	education: '教育',
	finances_and_insurance: '金融・保険',
	food_and_delivery: 'フード・デリバリー',
	gaming: 'ゲーム',
	health_and_fitness: '健康・フィットネス',
	hosting_and_vps: 'ホスティング・VPS',
	marketing: 'マーケティング',
	music_and_audiobooks: '音楽・オーディオブック',
	news_and_reading: 'ニュース・読書',
	paas_and_deployment: 'PaaS・デプロイ',
	pets: 'ペット',
	productivity: '生産性',
	shopping_and_memberships: 'ショッピング・会員制',
	smart_home_and_iot: 'スマートホーム・IoT',
	social: 'ソーシャル',
	transportation: '交通',
	travel_and_flights: '旅行・フライト',
	utilities_and_bills: '公共料金・請求',
	vpn_and_security: 'VPN・セキュリティ',
	video_streaming: '動画ストリーミング'
};

const nihongo: LocaleRootT = {
	tokens: { regions, countries, currencies, languages },
	ios: {
		CFBundleDisplayName: 'Uha'
	},
	dates: {
		today: '今日',
		tomorrow: '明日',
		yesterday: '昨日',
		day: '日',
		month: '月',
		year: '年',
		in_month: '{{month}}',
		in_year: '{{year}}年'
	},
	rates: {
		error: {
			title: 'レート更新に失敗',
			description: '通貨換算が不正確な場合があります'
		},
		success: {
			title: 'レート更新完了'
		}
	},
	category: defaultCategories,

	navbar: {
		transactions: {
			title: 'ホーム',
			go_to_today: '今日に移動',
			view_list: 'リスト表示',
			view_calendar: 'カレンダー表示',
			open_filters: 'フィルター'
		},
		library: {
			title: 'ライブラリ',
			categories: 'カテゴリ',
			services: 'サービス',
			payments: '支払い方法'
		},
		settings: {
			title: '設定',
			refresh_rates: 'レート更新'
		},
		add: {
			title: '新規',
			service: '新しいサービス',
			category: '新しいカテゴリ',
			payment: '新しい支払い方法',
			subscription: '新しいサブスクリプション'
		}
	},

	transactions: transactionsScreen,
	library: libraryScreen,
	settings: settingsScreen,

	crossroad: {
		no_results: '何も見つかりませんでした',
		grid: {
			category: {
				title: 'カテゴリ',
				description: 'サービスの分類'
			},
			service: {
				title: 'サービス',
				description: 'アプリまたはサービス'
			},
			payment: {
				title: '支払い方法',
				description: 'カードまたはその他の決済手段'
			},
			subscription: {
				title: 'サブスクリプション',
				description: 'サブスクを一から作成'
			}
		},
		add: {
			header: 'サービスを探す',
			search_bar: 'サービスを検索',
			search_results: '検索結果',
			sections: {
				top_hit: 'ベストマッチ',
				verified: '認証済み',
				external: '外部'
			}
		}
	}
};

export default nihongo;
