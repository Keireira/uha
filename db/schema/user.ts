import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { currenciesTable } from './currencies';

import type { AccentT } from '@themes/themes.d';
import type { SourceT } from '@api/soup';

export const userTable = sqliteTable('user', {
	id: text().primaryKey(), // uuid v4
	theme: text().$type<'auto' | 'light' | 'dark'>().default('auto').notNull(),
	oled_mode: int({ mode: 'boolean' }).default(false).notNull(),
	max_horizon: int().default(2).notNull(),
	recalc_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	default_currency: text()
		.references(() => currenciesTable.id)
		.notNull(), // e.g. 'USD' | 'RUB' | ...
	first_day: text().$type<'monday' | 'sunday'>().default('monday').notNull(),
	ai_enabled: int({ mode: 'boolean' }).default(false).notNull(),
	is_unlimited: int({ mode: 'boolean' }).default(false).notNull(),
	accent: text().$type<AccentT>().default('orange').notNull(),
	appstore_country: text().notNull(),
	playstore_country: text().notNull(),
	playstore_lang: text().notNull(),
	search_sources: text({ mode: 'json' }).$type<SourceT[]>().default(['inhouse', 'appstore', 'web']).notNull()
});
