import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { currenciesTable } from './currencies';
import { subscriptionsTable } from './subscriptions';

/* Union-typed event log covering the full subscription lifecycle:
 * trial / first_payment / price_up / price_down / pause / resume / refund / cancellation.
 */
export const timelineEventsTable = sqliteTable(
	'timeline_events',
	{
		id: text().primaryKey(), // uuid v4
		subscription_id: text()
			.references(() => subscriptionsTable.id, { onDelete: 'cascade' })
			.notNull(),

		type: text({
			enum: ['trial', 'first_payment', 'price_up', 'price_down', 'pause', 'resume', 'refund', 'cancellation']
		}).notNull(),
		date: text()
			.default(sql`(CURRENT_DATE)`)
			.notNull(), // YYYY-MM-DD
		/** Minor units, set only for priced event types. */
		amount: int({ mode: 'number' }),
		/** FK to currencies, set only for priced event types. */
		currency_id: text().references(() => currenciesTable.id),
		/** Trial duration unit (days | weeks | months | years). */
		duration_type: text({ enum: ['days', 'weeks', 'months', 'years'] }),
		duration_value: int({ mode: 'number' }),
		/** Free-form note attached to pause / cancellation events. */
		reason: text()
	},
	(table) => [index('timeline_events_subscription_id_idx').on(table.subscription_id, table.date)]
);
