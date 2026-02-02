import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
			| 'caribbean'
			| 'europe'
			| 'central_asia'
			| 'south_asia'
			| 'east_asia'
			| 'south_asia'
			| 'southeast_asia'
			| 'oceania'
			| 'other'
			| 'cryptocurrency'
		>()
		.notNull()
});
