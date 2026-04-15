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
	appstore_country: text().default('US').notNull(),
	playstore_country: text().default('US').notNull(),
	playstore_lang: text().default('en').notNull(),
	search_sources: text({ mode: 'json' })
		.$type<SourceT[]>()
		.default(['inhouse', 'appstore', 'playstore', 'web', 'brandfetch'])
		.notNull(),
	color_presets: text({ mode: 'json' })
		.$type<string[]>()
		.default([
			'#f3a683', '#f19066', '#f7d794', '#f5cd79', '#778beb', '#546de5',
			'#e77f67', '#e15f41', '#cf6a87', '#c44569', '#786fa6', '#574b90',
			'#f8a5c2', '#f78fb3', '#63cdda', '#3dc1d3', '#ea8685', '#e66767'
		])
		.notNull()
});
