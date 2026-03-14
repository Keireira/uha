import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { LOADING_ACTIONS } from '../use-loading';
import { useAccent, useEntitlement, useFeatureGate } from '@hooks';
import { shareCsvExport, restoreFromCsvBackup } from '@lib/backup';

import { Text } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import Root, { Inner, Title } from './csv-backup.styles';

import type { UseLoadingReturnT } from '../use-loading';

const CSVBackup = ({ withLoading, loadingAction, isLoading }: UseLoadingReturnT) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const accentColor = useAccent();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();

	const { isDisabled, isLocalLoading } = useMemo(
		() => ({
			isDisabled: isLoading,
			isLocalLoading: [LOADING_ACTIONS.CSVBackup, LOADING_ACTIONS.CSVRestore].includes(loadingAction)
		}),
		[isLoading, loadingAction]
	);

	const createCsvBackup = withLoading(LOADING_ACTIONS.CSVBackup, async () => {
		try {
			await shareCsvExport();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.export_success') });
		} catch (err) {
			console.error('[DB] ✗ Backup failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.export_error') });
		}
	});

	const restoreCsvBackup = withLoading(LOADING_ACTIONS.CSVRestore, async () => {
		try {
			const ok = await restoreFromCsvBackup();

			if (ok) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				Toast.show({ type: 'success', text1: t('settings.data.import_success') });
			}
		} catch (err) {
			console.error('[DB] ✗ Restore failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.import_error') });
		}
	});

	const handleCSVPress = () => {
		if (isDisabled) return;

		if (!tier.csvExport) return openFeatureGate();

		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [t('settings.data.export_csv'), t('settings.data.import_csv'), t('settings.data.cancel')],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 2
			},
			(index) => {
				if (index === 0) createCsvBackup();
				if (index === 1) restoreCsvBackup();
			}
		);
	};

	return (
		<Root $disabled={isDisabled} isInteractive={!isDisabled}>
			<Inner disabled={isDisabled} onPress={handleCSVPress}>
				<Title>
					<SymbolView name="tablecells" size={20} tintColor={accentColor} />

					<Text $weight={500}>CSV</Text>
				</Title>

				{isLocalLoading ? (
					<ActivityIndicator size="small" color={accentColor} />
				) : (
					<SymbolView name="arrow.up.right" size={16} tintColor={theme.text.tertiary} />
				)}
			</Inner>
		</Root>
	);
};

export default CSVBackup;
