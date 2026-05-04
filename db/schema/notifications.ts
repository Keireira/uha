import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { subscriptionsTable } from './subscriptions';

// 'date': DATE one-shot reminder for a specific payment cycle, must be re-scheduled on app launch
// 'trial_end': DATE one-shot for trial-end, never re-scheduled
export const NOTIFICATION_KINDS = ['date', 'trial_end'] as const;
export type NotificationKindT = (typeof NOTIFICATION_KINDS)[number];

export const notificationsTable = sqliteTable(
	'notifications',
	{
		id: text().primaryKey(), // UUID identifier for push notification
		linked_subscription_id: text()
			.references(() => subscriptionsTable.id, { onDelete: 'cascade' })
			.notNull(),
		kind: text({ enum: NOTIFICATION_KINDS }).notNull(),
		// ISO datetime of the scheduled fire moment. Used to detect stale rows on reconcile.
		fire_date: text().notNull()
	},
	(table) => [index('notifications_linked_subscription_id_idx').on(table.linked_subscription_id)]
);
