export const FREE_TIER = {
	maxSubscriptions: 5,
	maxCurrencies: 3,
	maxHorizon: 3,
	allowedFirstDays: [1] as number[], // Monday only
	hasPremiumAI: false // NL input, insights, alerts — Unlimited only
} as const;

export const UNLIMITED_TIER = {
	maxSubscriptions: Infinity,
	maxCurrencies: Infinity,
	maxHorizon: 10,
	allowedFirstDays: [0, 1] as number[], // Sun, Mon
	hasPremiumAI: true
} as const;

export type UnlimitedType = 'monthly' | 'annual' | 'lifetime';

export type EntitlementT = {
	isUnlimited: boolean;
	unlimitedType: UnlimitedType | null;
	unlimitedExpiresAt: string | null;
	tier: typeof FREE_TIER | typeof UNLIMITED_TIER;
};

/** Currencies always available in free tier: USD, EUR + device region currency */
export const FREE_CURRENCY_BASE = ['USD', 'EUR'] as const;
