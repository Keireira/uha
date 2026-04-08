import type { ProviderMeta } from './search-sources.d';

export const PROVIDERS: ProviderMeta[] = [
	{
		key: 'appstore',
		color_slug: 'blue',
		labelKey: 'settings.sources.appstore',
		storeConfig: 'country'
	},
	{
		key: 'playstore',
		color_slug: 'green',
		labelKey: 'settings.sources.playstore',
		storeConfig: 'country+lang'
	},
	{
		key: 'web',
		color_slug: 'orange',
		labelKey: 'settings.sources.web'
	},
	{
		key: 'brandfetch',
		color_slug: 'purple',
		labelKey: 'settings.sources.brandfetch'
	},
	{
		key: 'logodev',
		color_slug: 'mint',
		labelKey: 'settings.sources.logo_dev'
	}
];

export const RAW_LANGUAGES: { code: string; name: string }[] = [
	{ code: 'en', name: 'English' },
	{ code: 'ru', name: 'Русский' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'fr', name: 'Français' },
	{ code: 'es', name: 'Español' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'pt', name: 'Português' },
	{ code: 'nl', name: 'Nederlands' },
	{ code: 'pl', name: 'Polski' },
	{ code: 'cs', name: 'Čeština' },
	{ code: 'hu', name: 'Magyar' },
	{ code: 'ro', name: 'Română' },
	{ code: 'uk', name: 'Українська' },
	{ code: 'kk', name: 'Қазақша' },
	{ code: 'tr', name: 'Türkçe' },
	{ code: 'ar', name: 'العربية' },
	{ code: 'he', name: 'עברית' },
	{ code: 'ja', name: '日本語' },
	{ code: 'ko', name: '한국어' },
	{ code: 'zh', name: '中文' },
	{ code: 'th', name: 'ไทย' },
	{ code: 'vi', name: 'Tiếng Việt' },
	{ code: 'id', name: 'Bahasa Indonesia' },
	{ code: 'ms', name: 'Bahasa Melayu' },
	{ code: 'hi', name: 'हिन्दी' },
	{ code: 'sv', name: 'Svenska' },
	{ code: 'da', name: 'Dansk' },
	{ code: 'nb', name: 'Norsk' },
	{ code: 'fi', name: 'Suomi' }
];
