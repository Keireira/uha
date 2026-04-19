import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { categoriesTable } from './categories';
import { servicesTable } from './services';
import { tendersTable } from './tenders';

export const subscriptionsTable = sqliteTable(
	'subscriptions',
	{
		id: text().primaryKey(), // uuid v4

		category_slug: text()
			.references(() => categoriesTable.slug)
			.notNull(), // uuid v4

		service_id: text()
			.references(() => servicesTable.id)
			.notNull(),
		custom_name: text(),

		billing_cycle_type: text().$type<'days' | 'weeks' | 'months' | 'years'>().default('months').notNull(),
		billing_cycle_value: int().default(1).notNull(),

		first_payment_date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(),
		tender_id: text().references(() => tendersTable.id), // uuid v4

		custom_emoji: text(), // SF Symbol name, set explicitly by user
		cancellation_date: text(), // Shall be empty if not canceled

		notes: text(), // user notes, multiline

		// notifications
		notify_enabled: int({ mode: 'boolean' }).default(false).notNull(),
		// JSON array of integers — days before the next payment to send a reminder, e.g. [0, 1, 3]
		notify_days_before: text().default('[1]').notNull()
	},
	(table) => [
		index('subscriptions_category_slug_idx').on(table.category_slug),
		index('subscriptions_service_id_idx').on(table.service_id),
		index('subscriptions_tender_id_idx').on(table.tender_id)
	]
);
