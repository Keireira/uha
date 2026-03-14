import React from 'react';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import useLoading from './use-loading';
import { shareDbBackup, restoreFromDbBackup } from '@lib/backup';

import CSVBackup from './csv-backup';
import { SymbolView } from 'expo-symbols';
import ICloudBackup from './icloud-backup';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import { TileRow, Tile, TileInner, TileTitle } from './data-sync.styles';

const hapticSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
const hapticError = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

const toast = (type: 'success' | 'error' | 'info', text1: string) => Toast.show({ type, text1 });

const DataSync = () => {
	const { t } = useTranslation();

	const accentColor = useAccent();
	const { withLoading, loadingAction, isLoading } = useLoading();

	/* DB backup */
	const createDbBackup = withLoading('db_backup', async () => {
		try {
			await shareDbBackup();

			hapticSuccess();
			toast('success', t('settings.data.backup_success'));
		} catch {
			hapticError();
			toast('error', t('settings.data.backup_error'));
		}
	});

	const restoreDbBackup = withLoading('db_restore', async () => {
		try {
			const ok = await restoreFromDbBackup();

			if (ok) {
				hapticSuccess();
				toast('success', t('settings.data.restore_success'));
			}
		} catch {
			hapticError();
			toast('error', t('settings.data.restore_error'));
		}
	});

	const tileStyle = (action: string) => {
		return isLoading && loadingAction !== action ? { opacity: 0.4 } : undefined;
	};

	return (
		<>
			<ICloudBackup isLoading={isLoading} loadingAction={loadingAction} withLoading={withLoading} />

			<TileRow>
				<Tile isInteractive={!isLoading}>
					<TileInner disabled={isLoading} onPress={createDbBackup} style={tileStyle('db_backup')}>
						{loadingAction === 'db_backup' ? (
							<ActivityIndicator size="small" color={accentColor} style={{ alignSelf: 'flex-start' }} />
						) : (
							<SymbolView name="arrow.up.doc" size={20} tintColor={accentColor} />
						)}

						<TileTitle>{t('settings.data.backup')}</TileTitle>
					</TileInner>
				</Tile>

				<Tile isInteractive={!isLoading}>
					<TileInner disabled={isLoading} onPress={restoreDbBackup} style={tileStyle('db_restore')}>
						{loadingAction === 'db_restore' ? (
							<ActivityIndicator size="small" color={accentColor} style={{ alignSelf: 'flex-start' }} />
						) : (
							<SymbolView name="arrow.down.doc" size={20} tintColor={accentColor} />
						)}

						<TileTitle>{t('settings.data.restore')}</TileTitle>
					</TileInner>
				</Tile>
			</TileRow>

			<CSVBackup isLoading={isLoading} loadingAction={loadingAction} withLoading={withLoading} />
		</>
	);
};

export default DataSync;
