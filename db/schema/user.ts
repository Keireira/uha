import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
import { currenciesTable } from './currencies';

export const userTable = sqliteTable('user', {
	id: text().primaryKey(), // uuid v4
	theme: text().$type<'auto' | 'light' | 'dark'>().default('auto').notNull(),
	oled_mode: int({ mode: 'boolean' }).default(false).notNull(),
	max_horizon: int().default(3).notNull(),
	with_color_grading: int({ mode: 'boolean' }).default(true).notNull(),
	explain_currency: int({ mode: 'boolean' }).default(true).notNull(),
	recalc_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	default_currency: text()
		.references(() => currenciesTable.id)
		.notNull() // e.g. 'USD' | 'RUB' | ...
});
