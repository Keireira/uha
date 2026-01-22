import { sql } from 'drizzle-orm';
import { sqliteTable, text, int, index } from 'drizzle-orm/sqlite-core';

import { tendersTable } from './tenders';
import { servicesTable } from './services';
import { categoriesTable } from './categories';
import { currenciesTable } from './currencies';

export const subscriptionsTable = sqliteTable(
	'subscriptions',
	{
		id: text().primaryKey(), // uuid v4

		category_id: text()
			.references(() => categoriesTable.id)
			.notNull(), // uuid v4

		service_id: text()
			.references(() => servicesTable.id)
			.notNull(),
		custom_name: text(),

		billing_cycle_type: text().$type<'days' | 'weeks' | 'months' | 'years'>().default('months').notNull(),
		billing_cycle_value: int().default(1).notNull(),

		// in MINOR UNITS!!!! (100 for 1 USD, 1000 for 1000 JPY
		current_price: int({ mode: 'number' }).notNull(),
		current_currency_id: text()
			.references(() => currenciesTable.id)
			.notNull(), // e.g. 'USD' | 'RUB' | ...

		first_payment_date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(),
		tender_id: text().references(() => tendersTable.id), // uuid v4

		cancellation_date: text() // Shall be empty if not canceled
	},
	(table) => [
		index('subscriptions_category_id_idx').on(table.category_id),
		index('subscriptions_service_id_idx').on(table.service_id),
		index('subscriptions_current_currency_id_idx').on(table.current_currency_id),
		index('subscriptions_tender_id_idx').on(table.tender_id)
	]
);
