import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsBridgeModule from '@modules/settings-bridge';
import { checkNotifications, RESULTS } from 'react-native-permissions';

import type { PermissionStatus } from 'react-native-permissions';

const useNotifications = () => {
	const { t } = useTranslation();
	const [notificationStatus, setNotificationStatus] = useState<PermissionStatus | null>(null);

	const statusLabels: Record<PermissionStatus, string> = useMemo(() => {
		return {
			[RESULTS.UNAVAILABLE]: '',
			[RESULTS.DENIED]: t('settings.system.notifications.results.denied'),
			[RESULTS.BLOCKED]: t('settings.system.notifications.results.blocked'),
			[RESULTS.GRANTED]: t('settings.system.notifications.results.granted'),
			[RESULTS.LIMITED]: t('settings.system.notifications.results.limited')
		};
	}, [t]);

	const check = () => {
		checkNotifications().then(({ status }) => {
			setNotificationStatus(status);
		});
	};

	useEffect(() => {
		check();

		SettingsBridgeModule.addListener('onNotificationChanged', () => {
			check();
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onNotificationChanged');
		};
	}, []);

	return {
		status: notificationStatus,
		label: statusLabels[notificationStatus ?? RESULTS.UNAVAILABLE]
	};
};

export default useNotifications;
