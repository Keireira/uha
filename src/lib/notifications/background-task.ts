import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { reconcileAllSubscriptions } from './reconcile';

export const NOTIFICATIONS_RECONCILE_TASK = 'com.keireira.uha.notifications-reconcile';

const TWELVE_HOURS_IN_MINUTES = 12 * 60;

TaskManager.defineTask(NOTIFICATIONS_RECONCILE_TASK, async () => {
	try {
		await reconcileAllSubscriptions();
		return BackgroundTask.BackgroundTaskResult.Success;
	} catch (err) {
		console.warn('[notifications] background reconcile failed:', err);
		return BackgroundTask.BackgroundTaskResult.Failed;
	}
});

export const registerNotificationsBackgroundTask = async (): Promise<void> => {
	const status = await BackgroundTask.getStatusAsync();
	if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;

	const isRegistered = await TaskManager.isTaskRegisteredAsync(NOTIFICATIONS_RECONCILE_TASK);
	if (isRegistered) return;

	await BackgroundTask.registerTaskAsync(NOTIFICATIONS_RECONCILE_TASK, {
		minimumInterval: TWELVE_HOURS_IN_MINUTES
	});
};
