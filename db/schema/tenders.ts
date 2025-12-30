import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tendersTable = sqliteTable('tenders', {
	id: text().primaryKey(), // uuid v4
	title: text().notNull(), // Altyn USD | AppStore | ...
	is_card: int({ mode: 'boolean' }).notNull().default(true), // true if card, false otherwise
	comment: text().default(''), // *8096 e.g.
	color: text().notNull(), // #0000FF | #00FFFF | ...
	emoji: text().notNull() // 💳 | 🍎 | ...
});
