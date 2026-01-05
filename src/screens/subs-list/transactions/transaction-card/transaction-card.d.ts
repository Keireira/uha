import { transactionsTable, currenciesTable, categoriesTable, servicesTable, subscriptionsTable } from '@db/schema';

type ServiceT = typeof servicesTable.$inferSelect;
type CategoryT = typeof categoriesTable.$inferSelect;
type CurrencyT = typeof currenciesTable.$inferSelect;
type TransactionT = typeof transactionsTable.$inferSelect;
type SubscriptionT = typeof subscriptionsTable.$inferSelect;

export type TransactionProps = {
	id: TransactionT['id'];
	currency: CurrencyT['symbol'];
	price: TransactionT['amount'];
	slug: ServiceT['slug'];
	customName: SubscriptionT['custom_name'];
	title: ServiceT['title'];
	emoji: CategoryT['emoji'];
	category: CategoryT['title'];
	color: ServiceT['color'];
	date: TransactionT['date'];
	denominator: CurrencyT['denominator'];
};
