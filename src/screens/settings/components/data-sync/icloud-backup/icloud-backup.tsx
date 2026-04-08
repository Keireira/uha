import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { openSettings } from 'expo-linking';
import * as Haptics from 'expo-haptics';

import { LOADING_ACTIONS } from '../use-loading';
import { useStatusText, useICloud } from './hooks';
import { useEntitlement, useFeatureGate, useAccent } from '@hooks';
import { backupToCloudKit, restoreFromCloudKit, BACKUP_STATUS } from '@lib/backup';

import { Text, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import Root, { Inner, Title } from './icloud-backup.styles';

import type { UseLoadingReturnT } from '../use-loading';

const ICloudBackup = ({ withLoading, loadingAction, isLoading }: UseLoadingReturnT) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const { iCloudStatus, markBackedUpNow } = useICloud();
	const [justBackedUp, setJustBackedUp] = useState(false);

	const accentColor = useAccent();
	const statusText = useStatusText(loadingAction);

	const { isChecking, isAvailable, isDisabled, isLocalLoading } = useMemo(
		() => ({
			isChecking: iCloudStatus === BACKUP_STATUS.CHECKING,
			isAvailable: iCloudStatus === BACKUP_STATUS.AVAILABLE,
			isDisabled: iCloudStatus === BACKUP_STATUS.CHECKING || isLoading,
			isLocalLoading: [LOADING_ACTIONS.ICloudBackup, LOADING_ACTIONS.ICloudRestore].includes(loadingAction)
		}),
		[isLoading, loadingAction, iCloudStatus]
	);

	useEffect(() => {
		if (!justBackedUp) return;

		const timeout = setTimeout(() => {
			setJustBackedUp(false);
		}, 4000);

		return () => clearTimeout(timeout);
	}, [justBackedUp]);

	const iCloudSymbol = useMemo(() => {
		if (isChecking) return 'link.icloud';
		if (justBackedUp) return 'checkmark.icloud';

		return isAvailable ? 'icloud' : 'icloud.dashed';
	}, [justBackedUp, isChecking, isAvailable]);

	const createICloudBackup = withLoading(LOADING_ACTIONS.ICloudBackup, async () => {
		try {
			await backupToCloudKit();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.icloud.backup.success') });

			markBackedUpNow();
			setJustBackedUp(true);
		} catch (err) {
			console.error('[iCloud] ✗ Backup failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.icloud.backup.error') });
		}
	});

	const restoreICloudBackup = withLoading(LOADING_ACTIONS.ICloudRestore, async () => {
		try {
			const ok = await restoreFromCloudKit();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({
				type: ok ? 'success' : 'info',
				text1: t(ok ? 'settings.data.icloud.restoresuccess' : 'settings.data.icloud.statuses.no_backup')
			});
		} catch (err) {
			console.error('[iCloud] ✗ Restore failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.icloud.restore.error') });
		}
	});

	const handleICloudPress = () => {
		if (isDisabled) return;

		if (!tier.backup) return openFeatureGate();
		if (!isAvailable) return openSettings();

		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [
					t('settings.data.icloud.backup.title'),
					t('settings.data.icloud.restore.title'),
					t('settings.data.cancel')
				],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 2
			},
			(index) => {
				if (index === 0) createICloudBackup();
				if (index === 1) restoreICloudBackup();
			}
		);
	};

	return (
		<Root isInteractive={!isDisabled}>
			<Inner disabled={isDisabled} onPress={handleICloudPress}>
				<Title>
					<SymbolView name={iCloudSymbol} size={20} tintColor={accentColor} />

					<Text $weight={500}>{t('settings.data.icloud.sync')}</Text>
				</Title>

				{isLocalLoading ? (
					<ActivityIndicator size="small" color={accentColor} />
				) : (
					<SmallText $color={theme.text.tertiary}>{statusText}</SmallText>
				)}
			</Inner>
		</Root>
	);
};

export default ICloudBackup;
