import { flatten } from 'ramda';
import { useState, useEffect } from 'react';

import { db } from '@src/sql-migrations';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { addDays, subDays, addMonths, addYears, addWeeks } from 'date-fns';
import { servicesTable, tendersTable, subscriptionsTable, transactionsTable } from '@db/schema';
import * as Crypto from 'expo-crypto';

const BILLING_CYCLES = {
	days: { min: 1, max: 365 },
	weeks: { min: 1, max: 52 },
	months: { min: 1, max: 24 },
	years: { min: 1, max: 2 }
} as const;

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createBillingCycleType = () => {
	return Object.keys(BILLING_CYCLES)[
		randomInt(0, Object.keys(BILLING_CYCLES).length - 1)
	] as keyof typeof BILLING_CYCLES;
};

type TransactionT = typeof transactionsTable.$inferSelect;
type SubscriptionT = typeof subscriptionsTable.$inferSelect;

const generateTransaction = (subscription: SubscriptionT, nextPaymentDate: Date) => {
	return {
		id: Crypto.randomUUID(),
		amount: subscription.current_price,
		date: nextPaymentDate.toISOString(),
		currency_id: subscription.current_currency_id,
		tender_id: subscription.tender_id || '',
		subscription_id: subscription.id
	};
};

const buildSubscription = (
	service: typeof servicesTable.$inferSelect,
	tenders: (typeof tendersTable.$inferSelect)[]
): SubscriptionT => {
	const tender = tenders[randomInt(0, tenders.length - 1)];
	const billingCycleType = createBillingCycleType();
	const days = randomInt(20, 365 * 2);

	return {
		id: Crypto.randomUUID(),

		category_id: service.category_id || '',
		service_id: service.id,
		custom_name: null,
		billing_cycle_type: billingCycleType,
		billing_cycle_value: randomInt(BILLING_CYCLES[billingCycleType].min, BILLING_CYCLES[billingCycleType].max),

		current_price: randomInt(125, 5555),
		current_currency_id: 'USD', // @TODO: Current? Replace it (and price as well) with price history item
		first_payment_date: subDays(new Date(), days).toISOString(),
		tender_id: tender.id,
		cancellation_date: null
	};
};

const buildMockTransactions = (subscriptions: SubscriptionT[]) => {
	const transactions: TransactionT[][] = [];

	for (const subscription of subscriptions) {
		const subscriptionTransactions: TransactionT[] = [];

		const today = new Date();
		let nextPaymentDate = new Date(subscription.first_payment_date);
		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		while (nextPaymentDate < today || (cancellationDate && nextPaymentDate <= cancellationDate)) {
			subscriptionTransactions.push(generateTransaction(subscription, nextPaymentDate));

			switch (subscription.billing_cycle_type) {
				case 'days':
					nextPaymentDate = addDays(nextPaymentDate, subscription.billing_cycle_value);
					break;
				case 'weeks':
					nextPaymentDate = addWeeks(nextPaymentDate, subscription.billing_cycle_value);
					break;
				case 'months':
					nextPaymentDate = addMonths(nextPaymentDate, subscription.billing_cycle_value);
					break;
				case 'years':
					nextPaymentDate = addYears(nextPaymentDate, subscription.billing_cycle_value);
					break;
			}
		}

		transactions.push(subscriptionTransactions);
	}

	return flatten(transactions);
};

const useMockedSubscriptions = () => {
	const [seeded, setSeeded] = useState(false);

	const { data: services } = useLiveQuery(db.select().from(servicesTable));
	const { data: tenders } = useLiveQuery(db.select().from(tendersTable));

	useEffect(() => {
		const seedMockData = async () => {
			if (!services.length || !tenders.length || seeded) return;

			await db.transaction(async (tx) => {
				await tx.delete(transactionsTable);
				await tx.delete(subscriptionsTable);
			});

			const subscriptionMocks = services.map((service) => buildSubscription(service, tenders));
			const transactionMocks = buildMockTransactions(subscriptionMocks);

			await db.transaction(async (tx) => {
				await tx.insert(subscriptionsTable).values(subscriptionMocks);
				await tx.insert(transactionsTable).values(transactionMocks);
			});

			setSeeded(true);
		};

		seedMockData();
	}, [services, tenders, seeded]);

	return seeded;
};

const SetupMocks = () => {
	useMockedSubscriptions();

	return null;
};

export default SetupMocks;
