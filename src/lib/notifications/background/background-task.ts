import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';

import { reconcileAllSubscriptions } from './reconcile';

export const NOTIFICATIONS_RECONCILE_TASK = 'com.keireira.uha.notifications-reconcile';

TaskManager.defineTask(NOTIFICATIONS_RECONCILE_TASK, async () => {
	try {
		await reconcileAllSubscriptions();
		console.log('[BG][Notifications] background reconcile has been succeded');

		return BackgroundTask.BackgroundTaskResult.Success;
	} catch (err) {
		console.warn('[BG][Notifications] background reconcile failed:', err);

		return BackgroundTask.BackgroundTaskResult.Failed;
	}
});

export const registerNotificationsBackgroundTask = async () => {
	const status = await BackgroundTask.getStatusAsync();
	if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;

	const isRegistered = await TaskManager.isTaskRegisteredAsync(NOTIFICATIONS_RECONCILE_TASK);
	if (isRegistered) {
		return;
	}

	await BackgroundTask.registerTaskAsync(NOTIFICATIONS_RECONCILE_TASK, {
		minimumInterval: 12 * 60 // 12 hours in minutes
	});
};
