import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tendersTable = sqliteTable('tenders', {
	id: text().primaryKey(), // uuid v4
	title: text().notNull(), // Altyn USD | AppStore | ...
	is_card: int({ mode: 'boolean' }).notNull().default(true), // true if card, false otherwise
	comment: text().default(''), // *8096 e.g.

	emoji: text(), // 🍔 | 🚗 | ...
	color: text().notNull(), // #FF0000 | #00FF00 | ...
	symbol: text(), // SF Symbol name
	logo_url: text() // URL of the logo
});
