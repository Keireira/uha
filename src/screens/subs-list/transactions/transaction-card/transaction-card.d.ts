import { transactionsTable, currenciesTable, categoriesTable, servicesTable, subscriptionsTable } from '@db/schema';

type ServiceT = typeof servicesTable.$inferSelect;
type CategoryT = typeof categoriesTable.$inferSelect;
type CurrencyT = typeof currenciesTable.$inferSelect;
type TransactionT = typeof transactionsTable.$inferSelect;
type SubscriptionT = typeof subscriptionsTable.$inferSelect;

export type TransactionProps = {
	id: TransactionT['id'];
	currency: CurrencyT['symbol'] | null;
	price: TransactionT['amount'];
	slug: ServiceT['slug'] | null;
	customName: SubscriptionT['custom_name'];
	title: ServiceT['title'] | null;
	emoji: CategoryT['emoji'] | null;
	category: CategoryT['title'] | null;
	color: ServiceT['color'] | null;
	date: TransactionT['date'];
	denominator: CurrencyT['denominator'] | null;
};
