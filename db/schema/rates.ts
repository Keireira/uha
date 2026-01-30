import { sql } from 'drizzle-orm';
import { sqliteTable, text, real, index, unique } from 'drizzle-orm/sqlite-core';

import { currenciesTable } from './currencies';

export const currencyRatesTable = sqliteTable(
	'currency_rates',
	{
		id: text().primaryKey(), // uuid v4
		target_currency_id: text()
			.references(() => currenciesTable.id)
			.notNull(), // EUR
		rate: real().notNull(), // 0.92
		date: text()
			.notNull()
			.default(sql`(CURRENT_DATE)`) // 2025-12-31
	},
	(table) => [
		index('currency_rates_lookup_idx').on(table.target_currency_id, table.date),
		unique('currency_rates_unique').on(table.target_currency_id, table.date)
	]
);
