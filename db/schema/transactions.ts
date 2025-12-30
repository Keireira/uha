import { sql } from 'drizzle-orm';
import { sqliteTable, text, real, index } from 'drizzle-orm/sqlite-core';

import { tendersTable } from './tenders';
import { currenciesTable } from './currencies';
import { subscriptionsTable } from './subscriptions';

export const transactionsTable = sqliteTable(
	'transactions',
	{
		id: text().primaryKey(), // uuid v4
		amount: real().notNull(),
		date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(),
		currency_id: text()
			.references(() => currenciesTable.id)
			.notNull(), // e.g. 'USD' | 'RUB' | ...
		tender_id: text()
			.references(() => tendersTable.id)
			.notNull(), // uuid v4

		subscription_id: text()
			.references(() => subscriptionsTable.id)
			.notNull()
	},
	(table) => [
		// WHERE subscription_id = <slug_name> ORDER BY date
		index('transactions_sub_date_idx').on(table.subscription_id, table.date),

		// SELECT * ORDER BY date (all transactions)
		index('transactions_date_idx').on(table.date)
	]
);
