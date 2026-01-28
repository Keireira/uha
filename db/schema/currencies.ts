import { sql } from 'drizzle-orm';
import { int, sqliteTable, text, real, index, unique } from 'drizzle-orm/sqlite-core';

export const currenciesTable = sqliteTable('currencies', {
	id: text().primaryKey(), // e.g. 'USD' | 'RUB' | ...
	symbol: text().notNull(), // $ | ₽ | ...
	denominator: int().notNull().default(100), // e.g 100 for USD, 1 for JPY, ...
	is_favorite: int({ mode: 'boolean' }).notNull().default(false)
});

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
