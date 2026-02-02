import { useState, useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import { subDays } from 'date-fns';
import { randomInt } from '@lib';

import db from '@db';
import { servicesTable, tendersTable, subscriptionsTable } from '@db/schema';

const BILLING_CYCLES = {
	days: { min: 1, max: 365 },
	weeks: { min: 1, max: 52 },
	months: { min: 1, max: 12 },
	years: { min: 1, max: 3 }
} as const;

const DAYS = randomInt(1, 365 * 2);

const createBillingCycleType = () => {
	return Object.keys(BILLING_CYCLES)[
		randomInt(0, Object.keys(BILLING_CYCLES).length - 1)
	] as keyof typeof BILLING_CYCLES;
};

type SubscriptionT = typeof subscriptionsTable.$inferSelect;

const CURRENCIES_POOL = [
	'USD',
	'EUR',
	'KZT',
	'RUB',
	'GBP',
	'CHF',
	'JPY',
	'CNY',
	'INR',
	'KGS',
	'MNT',
	'KRW',
	'PHP',
	'TJS',
	'THB',
	'KPW',
	'UZS',
	'VND',
	'LAK',
	'SGD',
	'HKD',
	'TWD',
	'MOP'
];

const buildSubscription = (
	service: typeof servicesTable.$inferSelect,
	tenders: (typeof tendersTable.$inferSelect)[]
): SubscriptionT => {
	const tender = tenders[randomInt(0, tenders.length - 1)];
	const billingCycleType = createBillingCycleType();
	const days = DAYS;

	return {
		id: Crypto.randomUUID(),

		category_id: service.category_id || '',
		service_id: service.id,
		custom_name: null,
		billing_cycle_type: billingCycleType,
		billing_cycle_value: randomInt(BILLING_CYCLES[billingCycleType].min, BILLING_CYCLES[billingCycleType].max),

		current_price: randomInt(125, 5555),
		current_currency_id: CURRENCIES_POOL[randomInt(0, CURRENCIES_POOL.length - 1)],
		first_payment_date: subDays(new Date(), days).toISOString(),
		tender_id: tender.id,
		cancellation_date: null
	};
};

const useSetupMocks = (areSettingsReady: boolean) => {
	const [seeded, setSeeded] = useState(false);

	useEffect(() => {
		if (seeded || !areSettingsReady) return;

		const seedMockData = async () => {
			const services = await db.select().from(servicesTable).all();
			const tenders = await db.select().from(tendersTable).all();

			const subscriptionMocks = services.map((service) => buildSubscription(service, tenders));

			// await db.transaction(async (tx) => {
			await db.delete(subscriptionsTable);
			await db.insert(subscriptionsTable).values(subscriptionMocks);
			// });

			setSeeded(true);
		};

		seedMockData();
	}, [seeded, areSettingsReady]);

	return seeded;
};

export default useSetupMocks;
