import { flatten } from 'ramda';
import * as Crypto from 'expo-crypto';
import { addDays, addMonths, addYears, addWeeks } from 'date-fns';
import { subscriptionsTable, transactionsTable } from '@db/schema';

type TransactionT = typeof transactionsTable.$inferSelect;
type SubscriptionT = typeof subscriptionsTable.$inferSelect;

const generateTransaction = (subscription: SubscriptionT, nextPaymentDate: Date, isCompleted: boolean) => {
	return {
		id: Crypto.randomUUID(),
		amount: subscription.current_price,
		status: isCompleted ? 'completed' : 'planned',
		date: nextPaymentDate.toISOString(),
		currency_id: subscription.current_currency_id,
		tender_id: subscription.tender_id || '',
		subscription_id: subscription.id
	};
};

const buildTransactions = (subscriptions: SubscriptionT[]) => {
	const transactions: TransactionT[][] = [];

	for (const subscription of subscriptions) {
		const subscriptionTransactions: TransactionT[] = [];

		const today = new Date();
		let nextPaymentDate = new Date(subscription.first_payment_date);
		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		while (nextPaymentDate < today || (cancellationDate && nextPaymentDate <= cancellationDate)) {
			subscriptionTransactions.push(generateTransaction(subscription, nextPaymentDate, true));

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

		subscriptionTransactions.push(generateTransaction(subscription, nextPaymentDate, false));

		transactions.push(subscriptionTransactions);
	}

	return flatten(transactions);
};

export default buildTransactions;
