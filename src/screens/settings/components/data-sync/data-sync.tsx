import React from 'react';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { SymbolView } from 'expo-symbols';

import ICloudBackup from './icloud-backup';

import { useEntitlement, useFeatureGate, useAccent } from '@hooks';
import { shareDbBackup, restoreFromDbBackup, shareCsvExport, restoreFromCsvBackup } from '@lib/backup';
import useLoading from './use-loading';
import { TileRow, Tile, TileInner, TileTitle, CsvButton, CsvButtonInner } from './data-sync.styles';

const hapticSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
const hapticError = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

const toast = (type: 'success' | 'error' | 'info', text1: string) => Toast.show({ type, text1 });

const DataSync = () => {
	const { t } = useTranslation();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const { withLoading, loadingAction, isLoading } = useLoading();

	const accentColor = useAccent();

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

	/* CSV */
	const requireCsvAccess = (): boolean => {
		if (!tier.csvExport) {
			openFeatureGate();

			return false;
		}

		return true;
	};

	const createCsvBackup = withLoading('csv_export', async () => {
		if (!requireCsvAccess()) return;

		try {
			await shareCsvExport();

			hapticSuccess();
			toast('success', t('settings.data.export_success'));
		} catch {
			hapticError();
			toast('error', t('settings.data.export_error'));
		}
	});

	const restoreCsvBackup = withLoading('csv_import', async () => {
		if (!requireCsvAccess()) return;

		try {
			const ok = await restoreFromCsvBackup();

			if (ok) {
				hapticSuccess();
				toast('success', t('settings.data.import_success'));
			}
		} catch {
			hapticError();
			toast('error', t('settings.data.import_error'));
		}
	});

	const openCsvMenu = () => {
		if (isLoading) return;
		if (!requireCsvAccess()) return;

		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [t('settings.data.export_csv'), t('settings.data.import_csv'), t('settings.data.cancel')],
				cancelButtonIndex: 2
			},
			(index) => {
				if (index === 0) createCsvBackup();
				if (index === 1) restoreCsvBackup();
			}
		);
	};

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

			<CsvButton $disabled={isLoading} isInteractive={!isLoading}>
				<CsvButtonInner disabled={isLoading} onPress={openCsvMenu}>
					{loadingAction === 'csv_export' || loadingAction === 'csv_import' ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<>
							<SymbolView name="tablecells" size={20} tintColor={accentColor} />
							<TileTitle $color={accentColor}>CSV</TileTitle>
						</>
					)}
				</CsvButtonInner>
			</CsvButton>
		</>
	);
};

export default DataSync;
