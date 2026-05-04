import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import i18next from 'i18next';

import { reconcileAllSubscriptions } from './reconcile';
import { registerNotificationsBackgroundTask } from './background-task';

const useReconcileNotificationsOnForeground = () => {
	const isReconcilingRef = useRef(false);

	useEffect(() => {
		registerNotificationsBackgroundTask()
			.then(() => {
				console.log('[FG][Notifications] background task registration succeeded');
			})
			.catch((err) => {
				console.warn('[FG][Notifications] background task registration failed:', err);
			});

		const run = async () => {
			if (isReconcilingRef.current) return;
			isReconcilingRef.current = true;

			try {
				await reconcileAllSubscriptions();
				console.log('[FG][Notifications] reconcile succeeded');
			} catch (err) {
				console.warn('[FG][Notifications] reconcile failed:', err);
			} finally {
				isReconcilingRef.current = false;
			}
		};

		run();

		const appStateSubscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') run();
		});

		const onLanguageChanged = () => run();
		i18next.on('languageChanged', onLanguageChanged);

		return () => {
			appStateSubscription.remove();
			i18next.off('languageChanged', onLanguageChanged);
		};
	}, []);
};

export default useReconcileNotificationsOnForeground;
