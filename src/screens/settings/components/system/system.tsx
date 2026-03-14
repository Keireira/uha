import React, { useMemo } from 'react';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { requestNotifications, RESULTS } from 'react-native-permissions';

import i18n from '@src/i18n';
import useNotifications from './use-notifications';

import Root, { Inner, Title, Subtitle } from './system.styles';

import type { PermissionStatus } from 'react-native-permissions';

const System = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const notification = useNotifications();

	const handleNotifications = () => {
		if (notification.status === RESULTS.DENIED) {
			requestNotifications();
		} else if (notification.status === RESULTS.BLOCKED) {
			openSettings();
		}
	};

	const isInteractive = useMemo(() => {
		if (!notification.status) return true;

		return ([RESULTS.DENIED, RESULTS.BLOCKED] as unknown as PermissionStatus).includes(notification.status);
	}, [notification.status]);

	const color = useMemo(() => {
		switch (notification.status) {
			case RESULTS.DENIED:
				return theme.accents.pink;
			case RESULTS.GRANTED:
				return theme.accents.green;
			case RESULTS.LIMITED:
				return theme.accents.yellow;
			default:
				return theme.text.tertiary;
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [theme.is_oled, theme.tint, notification.status]);

	return (
		<>
			<Root isInteractive={isInteractive}>
				<Inner disabled={!isInteractive} onPress={handleNotifications}>
					<Title numberOfLines={1}>{t('settings.system.notifications.header')}</Title>

					<Subtitle $color={color} numberOfLines={1}>
						{notification.label}
					</Subtitle>
				</Inner>
			</Root>

			<Root isInteractive>
				<Inner onPress={openSettings}>
					<Title numberOfLines={1}>{t('settings.system.language')}</Title>

					<Subtitle numberOfLines={1}>{t(`languages.${i18n.language}`)}</Subtitle>
				</Inner>
			</Root>
		</>
	);
};

export default System;
