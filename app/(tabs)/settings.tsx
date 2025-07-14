import React, { useEffect, useState } from 'react';

import i18n from '@src/i18n';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';
import SettingsBridgeModule from '@modules/settings-bridge';

import { Wrapper, List } from '@ui';
import { Settings, useColorScheme } from 'react-native';
import { requestNotifications, checkNotifications, RESULTS } from 'react-native-permissions';

import type { Props as ListProps } from '@ui/list/list.d';
import type { PermissionStatus } from 'react-native-permissions';

const NOTIFICATION_STATUS_LABELS: Record<PermissionStatus, string> = {
	[RESULTS.UNAVAILABLE]: '',
	[RESULTS.DENIED]: 'Not requested',
	[RESULTS.BLOCKED]: 'Denied',
	[RESULTS.GRANTED]: 'All good',
	[RESULTS.LIMITED]: 'All good'
};

const useGetNotificationStatus = () => {
	const [notificationStatus, setNotificationStatus] = useState<PermissionStatus | null>(null);

	const check = () => {
		checkNotifications().then(({ status }) => {
			setNotificationStatus(status);
		});
	};

	useEffect(() => {
		check();

		SettingsBridgeModule.addListener('onNotificationChanged', (event) => {
			check();
		});

		return () => {
			SettingsBridgeModule.removeAllListeners('onNotificationChanged');
		};
	}, []);

	return {
		status: notificationStatus,
		label: NOTIFICATION_STATUS_LABELS[notificationStatus ?? RESULTS.UNAVAILABLE]
	};
};

const SettingsScreen = () => {
	const { t } = useTranslation();
	const colorScheme = useColorScheme();

	const notificationStatus = useGetNotificationStatus();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

	useEffect(() => {
		setIsDarkMode(colorScheme === 'dark');
	}, [colorScheme]);

	const changeColorScheme = (isDarkMode: boolean) => {
		Settings.set({ theme: isDarkMode ? 'dark' : 'light' });
		setIsDarkMode(isDarkMode);
	};

	const handleNotifications = () => {
		if (notificationStatus.status === RESULTS.DENIED) {
			requestNotifications();
		} else if (notificationStatus.status === RESULTS.BLOCKED) {
			Linking.openSettings();
		}
	};

	const openSettings = () => {
		Linking.openSettings();
	};

	const sections: ListProps['sections'] = [
		{
			id: 'general-section',
			title: 'General',
			innerArray: [
				{
					id: 'general-in-app-notifications',
					title: 'Notifications',
					accessory: {
						type: 'plain-action',
						trigger: notificationStatus.label,
						onPress: handleNotifications
					}
				}
			]
		},
		{
			id: 'appearance-section',
			title: 'Appearance',
			innerArray: [
				{
					id: 'appearance-language',
					title: 'Language',
					accessory: {
						type: 'plain-action',
						trigger: t(`languages.${i18n.language}`),
						onPress: openSettings
					}
				},
				{
					id: 'appearance-dark-mode',
					title: 'Dark Mode',
					accessory: {
						type: 'switch',
						value: isDarkMode,
						onPress: changeColorScheme
					}
				}
			]
		}
	];

	return <Wrapper<ListProps> as={List} withBottom={false} sections={sections} />;
};

export default SettingsScreen;
