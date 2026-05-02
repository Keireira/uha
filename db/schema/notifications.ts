import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { subscriptionsTable } from './subscriptions';

export const notificationsTable = sqliteTable(
	'notifications',
	{
		id: text().primaryKey(), // UUID identifier for push notification
		linked_subscription_id: text()
			.references(() => subscriptionsTable.id, { onDelete: 'cascade' })
			.notNull()
	},
	(table) => [index('notifications_linked_subscription_id_idx').on(table.linked_subscription_id)]
);
