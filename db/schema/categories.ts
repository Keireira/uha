import { sqliteTable, text, unique, int } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable(
	'categories',
	{
		slug: text().primaryKey(),
		title: text(),
		is_system: int({ mode: 'boolean' }).default(false).notNull(),

		emoji: text(), // 🍔 | 🚗 | ...
		color: text().notNull(), // #FF0000 | #00FF00 | ...
		symbol: text(), // SF Symbol name
		logo_url: text() // URL of the logo
	},
	(table) => [unique('categories_full_unique').on(table.emoji, table.color)]
);
