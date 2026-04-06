/** Convert ISO 3166-1 alpha-2 code to flag emoji */
export const codeToFlag = (code: string): string =>
	String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));

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
