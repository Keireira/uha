import { useState, useEffect } from 'react';

import { sql } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, tendersTable, subscriptionsTable } from '@db/schema';
import * as Crypto from 'expo-crypto';
import { subDays } from 'date-fns';

const BILLING_CYCLES = {
	days: { min: 1, max: 365 },
	weeks: { min: 1, max: 52 },
	months: { min: 1, max: 24 },
	years: { min: 1, max: 10 }
} as const;

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createBillingCycleType = () => {
	return Object.keys(BILLING_CYCLES)[
		randomInt(0, Object.keys(BILLING_CYCLES).length - 1)
	] as keyof typeof BILLING_CYCLES;
};

const buildSubscription = (
	service: typeof servicesTable.$inferSelect,
	tenders: (typeof tendersTable.$inferSelect)[]
): typeof subscriptionsTable.$inferInsert => {
	const tender = tenders[randomInt(0, tenders.length - 1)];
	const billingCycleType = createBillingCycleType();
	const days = randomInt(20, 2000);

	return {
		id: Crypto.randomUUID(),

		category_id: service.category_id || '',
		service_id: service.id,
		custom_name: null,
		billing_cycle_type: billingCycleType,
		billing_cycle_value: randomInt(BILLING_CYCLES[billingCycleType].min, BILLING_CYCLES[billingCycleType].max),

		current_price: randomInt(5, 555),
		current_currency_id: 'USD',
		first_payment_date: subDays(new Date(), days).toISOString(),
		tender_id: tender.id,
		cancellation_date: null
	};
};

export const useMockedSubscriptions = () => {
	const [seeded, setSeeded] = useState(false);

	const { data: services } = useLiveQuery(
		db
			.select()
			.from(servicesTable)
			.orderBy(sql`RANDOM()`)
	);

	const { data: tenders } = useLiveQuery(
		db
			.select()
			.from(tendersTable)
			.orderBy(sql`RANDOM()`)
	);

	useEffect(() => {
		const seedMockData = async () => {
			if (services.length === 0 || tenders.length === 0 || seeded) return;

			await db.delete(subscriptionsTable);

			const mocks = services.map((service) => buildSubscription(service, tenders));
			await db.insert(subscriptionsTable).values(mocks);

			setSeeded(true);
		};

		seedMockData();
	}, [services, tenders, seeded]);

	return seeded;
};
