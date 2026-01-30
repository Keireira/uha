import { sql } from 'drizzle-orm';
import { int, sqliteTable, text, real, index, unique } from 'drizzle-orm/sqlite-core';

export const currenciesTable = sqliteTable('currencies', {
	id: text().primaryKey(), // e.g. 'USD' | 'RUB' | ...
	symbol: text().notNull(), // $ | ₽ | ...
	denominator: int().notNull().default(100), // e.g 100 for USD, 1 for JPY, ...
	fraction_digits: int().notNull().default(2), // Number of '0' from denominator
	intl_locale: text().notNull(), // e.g 'en-US' | 'ru-RU' | ...
	region: text()
		.$type<
			| 'africa'
			| 'north_america'
			| 'central_america'
			| 'south_america'
			| 'europe'
			| 'central_asia'
			| 'south_asia'
			| 'east_asia'
			| 'south_asia'
			| 'southeast_asia'
			| 'caribbean'
			| 'oceania'
			| 'other'
			| 'cryptocurrency'
		>()
		.notNull()
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
