import { useMemo } from 'react';
import { max as maxR } from 'ramda';
import * as Crypto from 'expo-crypto';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { and, eq, max } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import {
	startOfToday,
	startOfTomorrow,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	endOfMonth,
	isAfter,
	isBefore
} from 'date-fns';

import {
	currenciesTable,
	servicesTable,
	tendersTable,
	categoriesTable,
	subscriptionsTable,
	transactionsTable
} from '@db/schema';

import type { AppliedFilterT } from '@models/app-model.d';

type SubscriptionT = typeof subscriptionsTable.$inferSelect;
type TransactionT = typeof transactionsTable.$inferSelect;
type ExtendedSubscriptionT = SubscriptionT & {
	latest_transaction_date: TransactionT['date'] | null;
};

type EnrichedSubscriptionT = {
	id: string;
	custom_name: string | null;
	billing_cycle_type: 'days' | 'weeks' | 'months' | 'years';
	billing_cycle_value: number;
	current_price: number;
	current_currency_id: string;
	first_payment_date: string;
	tender_id: string | null;
	cancellation_date: string | null;
	latest_transaction_date: string | null;
	currency: string | null;
	denominator: number | null;
	slug: string | null;
	title: string | null;
	emoji: string | null;
	category: string | null;
	color: string | null;
	categoryId: string | null;
	serviceId: string | null;
	currencyId: string;
	tenderId: string | null;
};

type PhantomTxProps = {
	id: string;
	currency: string | null;
	denominator: number | null;
	price: number;
	slug: string | null;
	title: string | null;
	customName: string | null;
	emoji: string | null;
	category: string | null;
	color: string | null;
	date: string;
};

const advanceDate = (date: Date, type: string, value: number) => {
	switch (type) {
		case 'days':
			return addDays(date, value);
		case 'weeks':
			return addWeeks(date, value);
		case 'months':
			return addMonths(date, value);
		case 'years':
			return addYears(date, value);
		default:
			return date;
	}
};

const filterSubscriptions = (subscriptions: EnrichedSubscriptionT[], filters: AppliedFilterT[]) => {
	if (!filters.length) return subscriptions;

	return subscriptions.filter((sub) => {
		for (const filter of filters) {
			if (filter.type === 'category' && sub.categoryId !== filter.value) return false;
			if (filter.type === 'service' && sub.serviceId !== filter.value) return false;
			if (filter.type === 'currency' && sub.currencyId !== filter.value) return false;
			if (filter.type === 'tender' && sub.tenderId !== filter.value) return false;
		}
		return true;
	});
};

// @TODO: Implement support of price history,and use data from it, not from `current_price`
const generatePhantomTransaction = (subscription: EnrichedSubscriptionT, nextPaymentDate: Date): PhantomTxProps => {
	const data = {
		id: Crypto.randomUUID(),
		price: subscription.current_price,
		date: nextPaymentDate.toISOString(),
		currency: subscription.currency,
		denominator: subscription.denominator,
		slug: subscription.slug,
		title: subscription.title,
		customName: subscription.custom_name,
		emoji: subscription.emoji,
		category: subscription.category,
		color: subscription.color
	};

	return data;
};

const createFutureTxs = (subscriptions: EnrichedSubscriptionT[], maxPaymentDate: Date) => {
	const tomorrow = startOfTomorrow();
	const futureTxs: PhantomTxProps[] = [];

	for (const subscription of subscriptions) {
		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		if (cancellationDate && isBefore(cancellationDate, tomorrow)) {
			continue;
		}

		const latestPaymentDate = subscription.latest_transaction_date
			? new Date(subscription.latest_transaction_date)
			: new Date(subscription.first_payment_date);
		let nextDate = advanceDate(latestPaymentDate, subscription.billing_cycle_type, subscription.billing_cycle_value);

		while (isBefore(nextDate, maxPaymentDate)) {
			futureTxs.push(generatePhantomTransaction(subscription, nextDate));
			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
		}
	}

	return futureTxs;
};

// const createFutureTxs = (subscriptions: EnrichedSubscriptionT[], maxPaymentDate: Date) => {
// 	const tomorrow = startOfTomorrow();
// 	const futureTxs: PhantomTxProps[] = [];

// 	for (const subscription of subscriptions) {
// 		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

// 		/* Skip fully cancelled subscriptions */
// 		if (cancellationDate && isBefore(cancellationDate, tomorrow)) {
// 			continue;
// 		}

// 		const subscriptionTransactions: TransactionT[] = [];
// 		const latestPaymentDate = subscription.latest_transaction_date
// 			? new Date(subscription.latest_transaction_date)
// 			: new Date(subscription.first_payment_date);
// 		let nextDate = advanceDate(latestPaymentDate, subscription.billing_cycle_type, subscription.billing_cycle_value);

// 		while (isBefore(nextDate, maxPaymentDate)) {
// 			subscriptionTransactions.push(generatePhantomTransaction(subscription, nextDate));
// 			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
// 		}

// 		futureTxs.push(...subscriptionTransactions);
// 	}

// 	return futureTxs;
// };

/* min horizon is 1 year, max horizon is the end of a month of latest subscription */
const findMaxPaymentDate = (subscriptions: ExtendedSubscriptionT[]) => {
	const today = startOfToday();
	const tomorrow = startOfTomorrow();

	let maxDate = today;

	for (const {
		cancellation_date,
		latest_transaction_date,
		first_payment_date,
		billing_cycle_type,
		billing_cycle_value
	} of subscriptions) {
		const cancellationDate = cancellation_date ? new Date(cancellation_date) : null;

		/* Skip fully cancelled subscriptions */
		if (cancellationDate && isBefore(cancellationDate, tomorrow)) {
			continue;
		}

		const latestPaymentDate = latest_transaction_date
			? new Date(latest_transaction_date)
			: new Date(first_payment_date);
		let nextDate = advanceDate(latestPaymentDate, billing_cycle_type, billing_cycle_value);

		if (isAfter(nextDate, maxDate)) {
			maxDate = nextDate;
		}
	}

	return maxR(addYears(today, 1), endOfMonth(maxDate));
};

const useCreatePhantomTxs = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	/* Get all subscriptions with their latest transaction date */
	const { data: subscriptions } = useLiveQuery(
		db
			.select({
				id: subscriptionsTable.id,
				custom_name: subscriptionsTable.custom_name,
				billing_cycle_type: subscriptionsTable.billing_cycle_type,
				billing_cycle_value: subscriptionsTable.billing_cycle_value,
				current_price: subscriptionsTable.current_price,
				current_currency_id: subscriptionsTable.current_currency_id,
				first_payment_date: subscriptionsTable.first_payment_date,
				tender_id: subscriptionsTable.tender_id,
				cancellation_date: subscriptionsTable.cancellation_date,
				latest_transaction_date: max(transactionsTable.date),
				/* Joined fields for use-sections */
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				slug: servicesTable.slug,
				title: servicesTable.title,
				emoji: categoriesTable.emoji,
				category: categoriesTable.title,
				color: servicesTable.color,
				/* Joined fields for use-sections */
				categoryId: categoriesTable.id,
				serviceId: servicesTable.id,
				currencyId: currenciesTable.id,
				tenderId: tendersTable.id
			})
			.from(subscriptionsTable)
			.leftJoin(currenciesTable, eq(subscriptionsTable.current_currency_id, currenciesTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(subscriptionsTable.tender_id, tendersTable.id))
			.leftJoin(transactionsTable, and(eq(subscriptionsTable.id, transactionsTable.subscription_id)))
			.groupBy(subscriptionsTable.id)
	);

	const futureTxs = useMemo(() => {
		if (!subscriptions.length) return [];

		const filtered = filterSubscriptions(subscriptions, lensesStore.filters);

		const maxPaymentDate = findMaxPaymentDate(filtered);
		let txs = createFutureTxs(filtered, maxPaymentDate);

		if (lensesStore.time_mode === 'future') {
			const now = new Date().toISOString();
			txs = txs.filter((tx) => tx.date >= now);
		}

		return txs;
	}, [subscriptions, lensesStore.filters, lensesStore.time_mode]);

	return futureTxs;
};

export default useCreatePhantomTxs;
