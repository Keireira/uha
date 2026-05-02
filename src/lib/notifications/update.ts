import { setupNotificationsFor } from './setup';
import { removeNotificationsFor } from './remove';

import type { SubscriptionT } from '@models';
import type { PushNotificationT } from './notifications.d';

export const updateNotificationsFor = (subscriptionId: SubscriptionT['id']) => {
	const remove = removeNotificationsFor(subscriptionId);
	const setup = setupNotificationsFor(subscriptionId);

	const handler = async (notifications: PushNotificationT[]) => {
		if (!subscriptionId) return [];

		await remove();

		return setup(notifications);
	};

	return handler;
};
