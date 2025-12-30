import { subscriptionsTable, currenciesTable, categoriesTable, servicesTable } from '@db/schema';

export type TransactionProps = {
	subscriptions: typeof subscriptionsTable.$inferSelect;
	currencies: typeof currenciesTable.$inferSelect;
	services: typeof servicesTable.$inferSelect;
	categories: typeof categoriesTable.$inferSelect;
};
