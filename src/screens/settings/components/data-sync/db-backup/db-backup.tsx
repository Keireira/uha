import React from 'react';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import { LOADING_ACTIONS } from '../use-loading';
import { shareDbBackup, restoreFromDbBackup } from '@lib/backup';

import { Text } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import Root, { Tile, Inner } from './db-backup.styles';

import type { UseLoadingReturnT } from '../use-loading';

const DBBackup = ({ withLoading, loadingAction, isLoading }: UseLoadingReturnT) => {
	const { t } = useTranslation();
	const accentColor = useAccent();

	const createDbBackup = withLoading(LOADING_ACTIONS.DBBackup, async () => {
		try {
			await shareDbBackup();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.backup_success') });
		} catch (err) {
			console.error('[DB] ✗ Backup failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.backup_error') });
		}
	});

	const restoreDbBackup = withLoading(LOADING_ACTIONS.DBRestore, async () => {
		try {
			const ok = await restoreFromDbBackup();

			if (ok) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				Toast.show({ type: 'success', text1: t('settings.data.restore_success') });
			}
		} catch (err) {
			console.error('[DB] ✗ Restore failed:', err);

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.restore_error') });
		}
	});

	return (
		<Root>
			<Tile isInteractive={!isLoading}>
				<Inner disabled={isLoading} onPress={createDbBackup}>
					{loadingAction === LOADING_ACTIONS.DBBackup ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<SymbolView name="arrow.up.doc" size={20} tintColor={accentColor} />
					)}

					<Text $weight={500}>{t('settings.data.backup')}</Text>
				</Inner>
			</Tile>

			<Tile isInteractive={!isLoading}>
				<Inner disabled={isLoading} onPress={restoreDbBackup}>
					{loadingAction === LOADING_ACTIONS.DBRestore ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<SymbolView name="arrow.down.doc" size={20} tintColor={accentColor} />
					)}

					<Text $weight={500}>{t('settings.data.restore')}</Text>
				</Inner>
			</Tile>
		</Root>
	);
};

export default DBBackup;
