import { useState, useEffect } from 'react';

import db from '@db';
import { randomInt } from '@lib';
import { subDays } from 'date-fns';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, tendersTable, subscriptionsTable } from '@db/schema';
import * as Crypto from 'expo-crypto';

const BILLING_CYCLES = {
	days: { min: 1, max: 365 },
	weeks: { min: 1, max: 52 },
	months: { min: 1, max: 12 },
	years: { min: 1, max: 3 }
} as const;

const DAYS = randomInt(1, 365);

const createBillingCycleType = () => {
	return Object.keys(BILLING_CYCLES)[
		randomInt(0, Object.keys(BILLING_CYCLES).length - 1)
	] as keyof typeof BILLING_CYCLES;
};

type SubscriptionT = typeof subscriptionsTable.$inferSelect;

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
		current_currency_id: 'USD',
		first_payment_date: subDays(new Date(), days).toISOString(),
		tender_id: tender.id,
		cancellation_date: null
	};
};

const useSetupMocks = () => {
	const [seeded, setSeeded] = useState(false);

	const { data: services } = useLiveQuery(db.select().from(servicesTable));
	const { data: tenders } = useLiveQuery(db.select().from(tendersTable));

	useEffect(() => {
		const seedMockData = async () => {
			if (seeded || !services?.length || !tenders?.length) return;

			await db.transaction(async (tx) => {
				await tx.delete(subscriptionsTable);
			});

			const subscriptionMocks = services.map((service) => buildSubscription(service, tenders));

			await db.transaction(async (tx) => {
				await tx.insert(subscriptionsTable).values(subscriptionMocks);
			});

			setSeeded(true);
		};

		seedMockData();
	}, [services, tenders, seeded]);

	return seeded;
};

export default useSetupMocks;
