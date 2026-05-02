import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';

import { silentDb } from '@db';
import { notificationsTable } from '@db/schema';

import type { SubscriptionT } from '@models';
import type { PushNotificationT } from './notifications.d';

type ScheduledRowT = {
	id: string;
	linked_subscription_id: SubscriptionT['id'];
	kind: PushNotificationT['kind'];
	fire_date: string;
};

// Notifications further than this window are not scheduled now — reconcile picks them up later
// (on next foreground or background task run). Keeps iOS pending queue lean and avoids stale text
// after locale changes / subscription edits.
const SCHEDULING_WINDOW_MS = 3 * 7 * 24 * 60 * 60 * 1000;

export const setupNotifications = async (
	subscriptionId: SubscriptionT['id'],
	notifications: PushNotificationT[]
): Promise<ScheduledRowT[]> => {
	const now = Date.now();
	const horizon = now + SCHEDULING_WINDOW_MS;
	const eligible = notifications.filter((notification) => {
		const ts = notification.date.getTime();
		return ts > now && ts <= horizon;
	});

	if (!eligible.length) return [];

	const rows = await Promise.all(
		eligible.map(async (notification) => {
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

			return {
				id,
				linked_subscription_id: subscriptionId,
				kind: notification.kind,
				fire_date: notification.date.toISOString()
			};
		})
	);

	return rows;
};

export const setupNotificationsFor = (subscriptionId: SubscriptionT['id']) => {
	return async (notifications: PushNotificationT[]): Promise<ScheduledRowT[]> => {
		const rows = await setupNotifications(subscriptionId, notifications);

		if (!rows.length) return [];

		await silentDb.insert(notificationsTable).values(rows);

		return rows;
	};
};
