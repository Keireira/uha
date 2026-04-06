import { expo as expoConfig } from '@src/../app.json';

export const FREE_TIER = {
	maxSubscriptions: 5,
	maxCurrencies: 3,
	maxHorizon: 3,
	hasPremiumAI: false,
	customCategories: false,
	iCloudSync: false,
	csvExport: false,
	allCurrencies: false,
	allRegions: false,
	allLanguages: false
} as const;

export const UNLIMITED_TIER = {
	maxSubscriptions: Infinity,
	maxCurrencies: Infinity,
	maxHorizon: 10,
	hasPremiumAI: true,
	customCategories: true,
	iCloudSync: true,
	csvExport: true,
	allCurrencies: true,
	allRegions: true,
	allLanguages: true
} as const;

export type EntitlementT = {
	isUnlimited: boolean;
	tier: typeof FREE_TIER | typeof UNLIMITED_TIER;
};

/** Currencies always available in free tier: USD, EUR + device region currency */
export const FREE_CURRENCY_BASE = ['USD', 'EUR'];
export const FREE_STORE_REGIONS_BASE = ['US'];
export const FREE_STORE_LANG_BASE = Object.keys(expoConfig.locales);
