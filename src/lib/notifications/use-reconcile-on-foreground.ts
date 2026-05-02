import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import i18next from 'i18next';

import { reconcileAllSubscriptions } from './reconcile';
import { registerNotificationsBackgroundTask } from './background-task';

export const useReconcileNotificationsOnForeground = () => {
	const isReconcilingRef = useRef(false);

	useEffect(() => {
		registerNotificationsBackgroundTask().catch((err) => {
			console.warn('[notifications] background task registration failed:', err);
		});

		const run = async () => {
			if (isReconcilingRef.current) return;
			isReconcilingRef.current = true;

			try {
				await reconcileAllSubscriptions();
			} catch (err) {
				console.warn('[notifications] reconcile failed:', err);
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
