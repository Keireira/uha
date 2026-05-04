import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import { isBefore, isEqual, addDays } from 'date-fns';

import { isAfterToday } from '@lib/date';

import { silentDb } from '@db';
import { notificationsTable } from '@db/schema';

import type { SubscriptionT } from '@models';
import type { PushNotificationT } from './notifications.d';

type ScheduledRowT = {
	id: string;
	fire_date: string;
	kind: PushNotificationT['kind'];
	linked_subscription_id: SubscriptionT['id'];
};

// Notifications further than this window are not scheduled now — reconcile picks them up later
// (on next foreground or background task run).
// The reason is a limit of 64 active scheduled notifications on iOS.
const RECONCILIATION_WINDOW_DAYS = 2 * 7;

const isWithinSchedulingWindow = (date: Date) => {
	const horizon = addDays(new Date(), RECONCILIATION_WINDOW_DAYS);

	return isAfterToday(date) && (isBefore(date, horizon) || isEqual(date, horizon));
};

const setupNotifications = async (subscriptionId: SubscriptionT['id'], notifications: PushNotificationT[]) => {
	const eligible = notifications.filter((notification) => isWithinSchedulingWindow(notification.date));

	if (!eligible.length) {
		return [];
	}

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
	const setup = async (notifications: PushNotificationT[]) => {
		const rows: ScheduledRowT[] = await setupNotifications(subscriptionId, notifications);

		if (!rows.length) {
			return [];
		}

		await silentDb.insert(notificationsTable).values(rows);

		return rows;
	};

	return setup;
};
