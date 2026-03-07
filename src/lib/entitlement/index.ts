export const FREE_TIER = {
	maxSubscriptions: 5,
	maxCurrencies: 3,
	maxHorizon: 3,
	hasPremiumAI: false // NL input, insights, alerts — Unlimited only
} as const;

export const UNLIMITED_TIER = {
	maxSubscriptions: Infinity,
	maxCurrencies: Infinity,
	maxHorizon: 10,
	hasPremiumAI: true
} as const;

export type EntitlementT = {
	isUnlimited: boolean;
	tier: typeof FREE_TIER | typeof UNLIMITED_TIER;
};

/** Currencies always available in free tier: USD, EUR + device region currency */
export const FREE_CURRENCY_BASE = ['USD', 'EUR'] as const;
