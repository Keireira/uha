import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable(
	'categories',
	{
		slug: text().primaryKey(),
		title: text(),
		emoji: text(), // 🍔 | 🚗 | ...
		color: text() // #FF0000 | #00FF00 | ...
	},
	(table) => [unique('categories_full_unique').on(table.emoji, table.color)]
);
