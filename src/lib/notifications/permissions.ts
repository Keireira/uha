import { useEffect, useState } from 'react';
import SettingsBridgeModule from '@modules/settings-bridge';
import { checkNotifications, RESULTS } from 'react-native-permissions';

import type { PermissionStatus } from 'react-native-permissions';

export const useNotificationsPermission = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [status, setStatus] = useState<PermissionStatus | null>(null);

	const refresh = async () => {
		const { status } = await checkNotifications();

		setStatus(status);
		setIsLoading(false);

		return status;
	};

	useEffect(() => {
		refresh();

		const subscription = SettingsBridgeModule.addListener('onNotificationChanged', refresh);

		return () => {
			subscription?.remove?.();
		};
	}, []);

	return {
		status,
		isLoading,
		isGranted: status === RESULTS.GRANTED,
		isDenied: status === RESULTS.DENIED,
		isBlocked: status === RESULTS.BLOCKED
	};
};

export type UseNotificationsPermission = ReturnType<typeof useNotificationsPermission>;

export default useNotificationsPermission;
