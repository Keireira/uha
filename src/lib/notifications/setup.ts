import { isAfter } from 'date-fns';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';

import { silentDb } from '@db';
import { notificationsTable } from '@db/schema';

import type { SubscriptionT } from '@models';
import type { PushNotificationT } from './notifications.d';

export const setupNotifications = async (notifications: PushNotificationT[]) => {
	const now = Date.now();
	const eligibleNotifications = notifications.filter((notification) => isAfter(notification.date, now));

	if (!eligibleNotifications.length) {
		return [];
	}

	const promises = Promise.all(
		eligibleNotifications.map(async (notification) => {
			const id = Crypto.randomUUID();

			await Notifications.scheduleNotificationAsync({
				identifier: id,
				content: {
					title: notification.title,
					body: notification.body
				},
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.DATE,
					date: notification.date
				}
			});

			return id;
		})
	);

	return promises;
};

export const setupNotificationsFor = (subscriptionId: SubscriptionT['id']) => {
	const handler = async (notifications: PushNotificationT[]) => {
		const newIDs = await setupNotifications(notifications);

		if (!newIDs.length) {
			return [];
		}

		await silentDb
			.insert(notificationsTable)
			.values(newIDs.map((id) => ({ id, linked_subscription_id: subscriptionId })));

		return newIDs;
	};

	return handler;
};
