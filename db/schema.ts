import { sql } from 'drizzle-orm';
import { int, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const currenciesTable = sqliteTable('currencies', {
	id: text().primaryKey().unique(), // e.g. 'USD' | 'RUB' | ...
	symbol: text().notNull(), // $ | ₽ | ...
	is_favorite: int({ mode: 'boolean' }).notNull().default(false)
});

// relation from master (currency_id) currency to other currencies on a date
export const currencyRatesTable = sqliteTable('currency_rates', {
	id: text().primaryKey().unique(), // uuid v4
	currency_id: text().references(() => currenciesTable.id), // e.g. 'USD' | 'RUB' | ...
	date: text().default(sql`(CURRENT_DATE)`), // YYYY-MM-DD
	rates: text({ mode: 'json' }).$type<Record<string, number>>().default({}) // e.g. { "currenciesTable.id": 1.002345 }
});

export const userTable = sqliteTable('user', {
	recalc_currency: text().references(() => currenciesTable.id), // e.g. 'USD' | 'RUB' | ...
	default_currency: text().references(() => currenciesTable.id) // e.g. 'USD' | 'RUB' | ...
});

export const categoriesTable = sqliteTable('categories', {
	id: text().primaryKey().unique(), // uuid v4
	title: text().notNull(), // Food | Transport | ...
	emoji: text().notNull(), // 🍔 | 🚗 | ...
	color: text().notNull() // #FF0000 | #00FF00 | ...
});

export const paymentMethodsTable = sqliteTable('payment_methods', {
	id: text().primaryKey().unique(), // uuid v4
	title: text().notNull(), // Altyn USD | AppStore | ...
	is_card: int({ mode: 'boolean' }).notNull().default(true), // true if card, false otherwise
	comment: text().default(''), // *8096 e.g.
	color: text().notNull(), // #0000FF | #00FFFF | ...
	emoji: text().notNull() // 💳 | 🍎 | ...
});

export const servicesTable = sqliteTable('services', {
	id: text().primaryKey().unique(), // uuid v4
	slug: text(), // adguard | spotify | ...
	title: text().notNull(), // Adguard | Spotify | ...
	color: text().notNull(), // #0000FF | #00FFFF | ...
	aliases: text({ mode: 'json' }).$type<string[]>().default([]), // ["адгард"]
	category_id: text().references(() => categoriesTable.id) // uuid v4
});

export const billingCyclesTable = sqliteTable('billing_cycles', {
	id: text().primaryKey().unique(), // day | week | month | year
	// e.g. for 'day' it will be from 1 to 365
	// e.g. for 'week' it will be from 1 to 52
	// e.g. for 'month' it will be from 1 to 24 (since here may be strange subs with periods like 1.5 months)
	// e.g. for 'year' it will be from 1 to 10
	min: int().notNull(),
	max: int().notNull()
});

export const subscriptionsTable = sqliteTable('subscriptions', {
	id: text().primaryKey().unique(), // uuid v4

	category_id: text().references(() => categoriesTable.id), // uuid v4

	service_id: text().references(() => servicesTable.id),
	custom_name: text(),

	currency_id: text().references(() => currenciesTable.id), // e.g. 'USD' | 'RUB' | ...
	amount: real().notNull(),
	first_payment_date: text().default(sql`(CURRENT_DATE)`),
	billing_cycle: text({ mode: 'json' }).$type<{ cycle_id: string; value: number }>(), // { "ref": billingCyclesTable.id, "value": 1 }

	payment_method_id: text().references(() => paymentMethodsTable.id), // uuid v4
	prices_history: text({ mode: 'json' }).$type<string[]>().default([]), // [pricesHistoryTable.id]

	note: text(),

	is_canceled: int({ mode: 'boolean' }).notNull().default(false),
	cancellation_date: text().default(sql`(CURRENT_DATE)`)
});

export const pricesHistoryTable = sqliteTable('prices_history', {
	id: text().primaryKey().unique(), // uuid v4
	amount: real().notNull(),
	date: text().default(sql`(CURRENT_DATE)`)
});
