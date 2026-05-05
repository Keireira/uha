import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable('categories', {
	slug: text().primaryKey(),
	title: text(),
	is_system: int({ mode: 'boolean' }).default(false).notNull(),

	emoji: text(), // 🍔 | 🚗 | ...
	color: text().notNull(), // #FF0000 | #00FF00 | ...
	symbol: text(), // SF Symbol name
	logo_url: text(), // URL of the logo

	initial_emoji: text(),
	initial_color: text().notNull(),
	initial_symbol: text(),
	initial_logo_url: text()
});
