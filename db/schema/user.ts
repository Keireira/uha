import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { currenciesTable } from './currencies';

export const userTable = sqliteTable('user', {
	id: text().primaryKey(), // uuid v4
	theme: text().$type<'auto' | 'light' | 'dark'>().default('auto').notNull(),
	recalc_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	default_currency: text()
		.references(() => currenciesTable.id)
		.notNull() // e.g. 'USD' | 'RUB' | ...
});
