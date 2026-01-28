import { useState, useEffect } from 'react';
import { max as maxR, splitEvery } from 'ramda';
import * as Crypto from 'expo-crypto';
import { advanceDate } from '@hooks/use-transactions/utils';
import { startOfToday, addYears, endOfYear, isAfter, isBefore } from 'date-fns';

import db from '@db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { subscriptionsTable, transactionsTable } from '@db/schema';

type SubscriptionT = typeof subscriptionsTable.$inferSelect;
type TransactionT = typeof transactionsTable.$inferSelect;

const findMaxNextPaymentDate = (subscriptions: SubscriptionT[]): Date => {
	const today = startOfToday();
	const defaultHorizon = addYears(today, 2);
	let maxDate = today;

	for (const subscription of subscriptions) {
		const { first_payment_date, billing_cycle_type, billing_cycle_value } = subscription;
		let nextDate = new Date(first_payment_date);

		while (nextDate < today) {
			nextDate = advanceDate(nextDate, billing_cycle_type, billing_cycle_value);
		}

		if (nextDate > maxDate) {
			maxDate = nextDate;
		}
	}

	return maxR(endOfYear(defaultHorizon), endOfYear(maxDate)) satisfies Date;
};

const buildTransaction = (subscription: SubscriptionT, nextPaymentDate: Date) => {
	const today = startOfToday();

	return {
		id: Crypto.randomUUID(),
		amount: subscription.current_price,
		date: nextPaymentDate.toISOString(),
		currency_id: subscription.current_currency_id,
		tender_id: subscription.tender_id || '',
		subscription_id: subscription.id,
		is_phantom: isAfter(nextPaymentDate, today)
	} satisfies TransactionT;
};

const createTransactions = (subscriptions: SubscriptionT[], maxNextPaymentDate: Date) => {
	const allTransactions: TransactionT[] = [];

	for (const subscription of subscriptions) {
		let nextPaymentDate = new Date(subscription.first_payment_date);
		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		if (cancellationDate && isBefore(cancellationDate, maxNextPaymentDate)) {
			continue;
		}

		while (nextPaymentDate < maxNextPaymentDate) {
			allTransactions.push(buildTransaction(subscription, nextPaymentDate));
			nextPaymentDate = advanceDate(nextPaymentDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
		}
	}

	return allTransactions satisfies TransactionT[];
};

const useFillUpMissedTxs = (areMocksSeeded: boolean) => {
	const [filledUp, setFilledUp] = useState(false);
	const { data: subscriptions } = useLiveQuery(db.select().from(subscriptionsTable));

	useEffect(() => {
		if (!areMocksSeeded) return;

		const initialize = async () => {
			const maxNextPaymentDate = findMaxNextPaymentDate(subscriptions);
			const generatedTransactions = createTransactions(subscriptions, maxNextPaymentDate);

			/* because of sqlite limit on the number of parameters in a single query */
			const batches = splitEvery(150, generatedTransactions);

			await db
				.transaction(async (tx) => {
					await tx.delete(transactionsTable);

					if (generatedTransactions.length) {
						for (const batch of batches) {
							await tx.insert(transactionsTable).values(batch);
						}
					}
				})
				.then(() => setFilledUp(true))
				.catch(console.error);
		};

		initialize();
	}, [areMocksSeeded, subscriptions]);

	return filledUp;
};

export default useFillUpMissedTxs;
