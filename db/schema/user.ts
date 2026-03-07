import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
import { currenciesTable } from './currencies';

import type { AccentT } from '@themes/themes.d';

export const userTable = sqliteTable('user', {
	id: text().primaryKey(), // uuid v4
	theme: text().$type<'auto' | 'light' | 'dark'>().default('auto').notNull(),
	oled_mode: int({ mode: 'boolean' }).default(false).notNull(),
	max_horizon: int().default(3).notNull(),
	recalc_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	default_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	is_unlimited: int({ mode: 'boolean' }).default(false).notNull(),
	accent: text().$type<AccentT>().default('orange').notNull()
});
