import { sql } from 'drizzle-orm';
import { sqliteTable, text, int, index } from 'drizzle-orm/sqlite-core';

import { tendersTable } from './tenders';
import { currenciesTable } from './currencies';
import { subscriptionsTable } from './subscriptions';

export const transactionsTable = sqliteTable(
	'transactions',
	{
		id: text().primaryKey(), // uuid v4
		date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(),

		// in MINOR UNITS!!!! (100 for 1 USD, 1000 for 1000 JPY etc...)
		amount: int({ mode: 'number' }).notNull(),
		currency_id: text()
			.references(() => currenciesTable.id)
			.notNull(), // e.g. 'USD' | 'RUB' | ...
		tender_id: text()
			.references(() => tendersTable.id)
			.notNull(), // uuid v4

		subscription_id: text()
			.references(() => subscriptionsTable.id)
			.notNull(),

		is_phantom: int({ mode: 'boolean' }).default(false).notNull()
	},
	(table) => [
		// WHERE subscription_id = <slug_name> ORDER BY date
		index('transactions_sub_date_idx').on(table.subscription_id, table.date),

		// SELECT * ORDER BY date (all transactions)
		index('transactions_date_idx').on(table.date)
	]
);
