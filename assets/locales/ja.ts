import type { LocaleRootT } from './locales.d';

const i18nLanguages: LocaleRootT['languages'] = {
	en: '英語',
	ru: 'ロシア語',
	kk: 'カザフ語',
	es: 'スペイン語',
	ja: '日本語'
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
		default_currency_code: 'デフォルト通貨',
		recalc_currency_code: '換算通貨',
		refresh_rates: '為替レート',
		search: '通貨を検索',
		primary: '主要',

		// target/region
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
		cryptocurrency: '暗号通貨',
		other: 'その他'
	},
	about: {
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
		boosty: 'Boosty'
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

const currenciesList: LocaleRootT['currencies'] = {
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
	HRK: 'クロアチア・クーナ',
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
	CUC: 'キューバ兌換ペソ',
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
	languages: i18nLanguages,
	category: defaultCategories,
	currencies: currenciesList,

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
	settings: settingsScreen
};

export default nihongo;
