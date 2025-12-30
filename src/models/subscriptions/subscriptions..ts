const BILLING_CYCLES = {
	day: { min: 1, max: 365 },
	week: { min: 1, max: 52 },
	month: { min: 1, max: 24 },
	year: { min: 1, max: 10 }
} as const;

type BillingCycleId = keyof typeof BILLING_CYCLES;
