import { sql } from 'drizzle-orm';
import { sqliteTable, text, real, index, unique } from 'drizzle-orm/sqlite-core';

import { currenciesTable } from './currencies';
import { subscriptionsTable } from './subscriptions';

export const priceHistoryTable = sqliteTable(
	'price_history',
	{
		id: text().primaryKey(), // uuid v4
		amount: real().notNull(),
		date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(),
		currency_id: text()
			.references(() => currenciesTable.id)
			.notNull(), // e.g. 'USD' | 'RUB' | ...

		subscription_id: text()
			.references(() => subscriptionsTable.id)
			.notNull()
	},
	(table) => [
		index('price_history_subscription_id_idx').on(table.subscription_id, table.date),
		unique('price_history_unique').on(table.subscription_id, table.date)
	]
);
