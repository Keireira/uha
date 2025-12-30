import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable(
	'categories',
	{
		id: text().primaryKey(), // uuid v4
		title: text().notNull(), // Food | Transport | ...
		emoji: text().notNull(), // 🍔 | 🚗 | ...
		color: text().notNull() // #FF0000 | #00FF00 | ...
	},
	(table) => [unique('categories_full_unique').on(table.title, table.emoji, table.color)]
);
