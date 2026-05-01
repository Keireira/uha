import { sqliteTable, text, unique, int } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable(
	'categories',
	{
		slug: text().primaryKey(),
		title: text(),
		emoji: text(), // 🍔 | 🚗 | ...
		color: text(), // #FF0000 | #00FF00 | ...
		is_system: int({ mode: 'boolean' }).default(false).notNull()
	},
	(table) => [unique('categories_full_unique').on(table.emoji, table.color)]
);
