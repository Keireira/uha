import { subscriptionsTable, transactionsTable, currenciesTable, servicesTable, categoriesTable } from '@db/schema';

export type TransactionT = typeof transactionsTable.$inferSelect;
export type SubscriptionT = typeof subscriptionsTable.$inferSelect;
export type CurrencyT = typeof currenciesTable.$inferSelect;
export type ServiceT = typeof servicesTable.$inferSelect;
export type CategoryT = typeof categoriesTable.$inferSelect;

export type PreparedDbTxT = {
	id: TransactionT['id'];
	currency: CurrencyT['symbol'];
	denominator: CurrencyT['denominator'];
	price: TransactionT['amount'];
	slug: ServiceT['slug'];
	title: ServiceT['title'];
	customName: SubscriptionT['custom_name'];
	emoji: CategoryT['emoji'];
	category: CategoryT['title'];
	color: ServiceT['color'];
	date: TransactionT['date'];
	category_id: CategoryT['id'];
};

export type PreparedSubscriptionT = SubscriptionT & {
	/*
	 * We may, or we may not, have a latest transaction date for a subscription
	 * If we don't, we will use the first payment date as a fallback later
	 */
	latest_transaction_date: TransactionT['date'] | null;
	currency: CurrencyT['symbol'];
	denominator: CurrencyT['denominator'];
	slug: ServiceT['slug'];
	title: ServiceT['title'];
	emoji: CategoryT['emoji'];
	category: CategoryT['title'];
	/* Do we really need to have service color here? */
	color: ServiceT['color'];
	category_color: CategoryT['color'];
};
