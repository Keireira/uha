import { subscriptionsTable, transactionsTable, currenciesTable, servicesTable, categoriesTable, tendersTable } from '@db/schema';

export type TransactionT = typeof transactionsTable.$inferSelect;
export type SubscriptionT = typeof subscriptionsTable.$inferSelect;
export type CurrencyT = typeof currenciesTable.$inferSelect;
export type ServiceT = typeof servicesTable.$inferSelect;
export type CategoryT = typeof categoriesTable.$inferSelect;
export type TenderT = typeof tendersTable.$inferSelect;

export type PreparedDbTxT = {
	id: TransactionT['id'];
	currency: CurrencyT['symbol'];
	currency_code: CurrencyT['id'];
	denominator: CurrencyT['denominator'];
	price: TransactionT['amount'];
	slug: ServiceT['slug'];
	title: ServiceT['title'];
	customName: SubscriptionT['custom_name'];
	emoji: CategoryT['emoji'];
	color: ServiceT['color'];
	date: TransactionT['date'];
	isPhantom: TransactionT['is_phantom'];
	comment: TransactionT['comment'];

	category_id: CategoryT['id'];
	category_title: CategoryT['title'];
	category_color: CategoryT['color'];

	tender_id: TenderT['id'] | null;
	tender_emoji: TenderT['emoji'] | null;
	tender_title: TenderT['title'] | null;
	tender_comment: TenderT['comment'] | null;
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
	color: ServiceT['color'];

	/* category-related fields. category_id is already included in the SubscriptionT */
	category_title: CategoryT['title'];
	category_color: CategoryT['color'];
};
