import { useState, useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import { subDays } from 'date-fns';
import { count } from 'drizzle-orm';
import { randomInt } from '@lib';

import db from '@db';
import { servicesTable, tendersTable, subscriptionsTable } from '@db/schema';

import type { SubscriptionT, TenderT, ServiceT } from '@models';

/**
 * Set to `true` to delete all subscriptions and recreate them from scratch.
 * Set to `false` to reuse existing subscriptions if they already exist in the DB.
 */
const RECREATE_MOCKS = false;

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

const buildSubscription = (service: ServiceT, tenders: TenderT[]): SubscriptionT => {
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

type MocksResult = { seeded: boolean; recreated: boolean };

const useSetupMocks = (): MocksResult => {
	const [result, setResult] = useState<MocksResult>({ seeded: false, recreated: false });

	useEffect(() => {
		if (result.seeded) return;

		const seedMockData = async () => {
			if (!RECREATE_MOCKS) {
				const [{ total }] = await db.select({ total: count() }).from(subscriptionsTable);

				if (total > 0) {
					if (__DEV__) {
						console.log(`\x1b[34m[SETUP MOCKS]: \x1b[32mReusing ${total} existing subscriptions\x1b[0m`);
					}
					setResult({ seeded: true, recreated: false });
					return;
				}
			}

			const services = await db.select().from(servicesTable).all();
			const tenders = await db.select().from(tendersTable).all();

			const subscriptionMocks = services.map((service) => buildSubscription(service, tenders));
			if (__DEV__) {
				console.log('\x1b[34m[SETUP MOCKS]: \x1b[33mNew subscriptions has been created\x1b[0m');
			}

			await db.delete(subscriptionsTable);
			if (__DEV__) {
				console.log('\x1b[34m[SETUP MOCKS]: \x1b[31mOld subscriptions has been deleted\x1b[0m');
			}

			await db.insert(subscriptionsTable).values(subscriptionMocks);
			if (__DEV__) {
				console.log('\x1b[34m[SETUP MOCKS]: \x1b[32mNew subscriptions has been inserted\x1b[0m');
			}

			setResult({ seeded: true, recreated: true });
		};

		seedMockData();
	}, [result.seeded]);

	return result;
};

export default useSetupMocks;
