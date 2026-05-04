import * as Notifications from 'expo-notifications';

import { silentDb } from '@db';
import { eq } from 'drizzle-orm';
import { notificationsTable } from '@db/schema';

import type { SubscriptionT } from '@models';

const EMPTY_RES = { cancelled: [], failed: [] };

const removeNotifications = async (notificationIds: string[]) => {
	const results = await Promise.allSettled(
		notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id))
	);

	const cancelled: string[] = [];
	const failedToCancel: string[] = [];

	results.forEach((result, index) => {
		const notification = notificationIds[index];

		if (result.status === 'fulfilled') {
			cancelled.push(notification);
		} else {
			failedToCancel.push(notification);
		}
	});

	return {
		cancelled,
		failed: failedToCancel
	};
};

export const removeNotificationsFor = (subscriptionId: SubscriptionT['id']) => {
	const handler = async () => {
		if (!subscriptionId) {
			return EMPTY_RES;
		}

		const notificationIds = silentDb
			.select()
			.from(notificationsTable)
			.where(eq(notificationsTable.linked_subscription_id, subscriptionId))
			.all()
			.map(({ id }) => id);

		if (!notificationIds.length) {
			return EMPTY_RES;
		}

		const result = await removeNotifications(notificationIds);

		if (result.cancelled.length) {
			await silentDb.delete(notificationsTable).where(eq(notificationsTable.linked_subscription_id, subscriptionId));
		}

		return result;
	};

	return handler;
};
