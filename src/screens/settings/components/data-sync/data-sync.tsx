import React from 'react';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import { openSettings } from 'expo-linking';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { SymbolView } from 'expo-symbols';

import { useSettingsValue, useEntitlement, useFeatureGate } from '@hooks';
import {
	shareDbBackup,
	restoreFromDbBackup,
	shareCsvExport,
	restoreFromCsvBackup,
	backupToCloudKit,
	restoreFromCloudKit,
	BACKUP_STATUS
} from '@lib/backup';
import useLoading from './use-loading';
import useICloud from './use-icloud';
import {
	Card,
	CardRow,
	CardRowTitle,
	CardRowValue,
	TileRow,
	Tile,
	TileInner,
	TileTitle,
	CsvButton,
	CsvButtonInner
} from './data-sync.styles';

import type { UserT } from '@models';

const hapticSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
const hapticError = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

const toast = (type: 'success' | 'error' | 'info', text1: string) => Toast.show({ type, text1 });

const formatLastBackup = (timestamp: string | null, t: (key: string) => string) => {
	if (timestamp == null) {
		return t('settings.data.icloud_no_backup');
	}

	try {
		return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
	} catch {
		return timestamp;
	}
};

const DataSync = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const { withLoading, loadingAction, isLoading } = useLoading();
	const { iCloudStatus, lastBackupTimestamp, checkICloudMeta } = useICloud();
	const accent = useSettingsValue<UserT['accent']>('accent');
	const accentColor = theme.accents[accent];

	const iCloudChecking = iCloudStatus === BACKUP_STATUS.CHECKING;
	const iCloudAvailable = iCloudStatus === BACKUP_STATUS.AVAILABLE;
	const iCloudBusy = loadingAction === 'icloud_backup' || loadingAction === 'icloud_restore';

	/* iCloud */
	const getICloudStatusText = () => {
		if (iCloudChecking) return t('settings.data.icloud_checking');
		if (!iCloudAvailable) return t('settings.data.icloud_unavailable');
		if (loadingAction === 'icloud_backup') return t('settings.data.icloud_backing_up');
		if (loadingAction === 'icloud_restore') return t('settings.data.icloud_restoring');

		return formatLastBackup(lastBackupTimestamp, t);
	};

	const handleICloudPress = () => {
		if (isLoading || iCloudChecking) return;

		if (!tier.iCloudSync) {
			return openFeatureGate();
		}

		if (!iCloudAvailable) {
			return openFeatureGate();
		}

		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [t('settings.data.icloud_backup'), t('settings.data.icloud_restore'), t('settings.data.cancel')],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 2
			},
			(index) => {
				if (index === 0) createICloudBackup();
				if (index === 1) restoreICloudBackup();
			}
		);
	};

	const createICloudBackup = withLoading('icloud_backup', async () => {
		try {
			await new Promise((r) => setTimeout(r, 0));
			await backupToCloudKit();

			hapticSuccess();
			toast('success', t('settings.data.icloud_backup_success'));
			checkICloudMeta();
		} catch {
			hapticError();
			toast('error', t('settings.data.icloud_backup_error'));
		}
	});

	const restoreICloudBackup = withLoading('icloud_restore', async () => {
		try {
			const ok = await restoreFromCloudKit();

			if (ok) {
				hapticSuccess();
				toast('success', t('settings.data.icloud_restore_success'));
			} else {
				toast('info', t('settings.data.icloud_no_backup'));
			}
		} catch (err) {
			console.error('[iCloud] ✗ Restore failed:', err);
			hapticError();
			toast('error', t('settings.data.icloud_restore_error'));
		}
	});

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
			<Card>
				<CardRow disabled={iCloudChecking || isLoading} onPress={handleICloudPress}>
					<CardRowTitle>{t('settings.data.icloud_sync')}</CardRowTitle>

					{iCloudBusy ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<CardRowValue>{getICloudStatusText()}</CardRowValue>
					)}
				</CardRow>
			</Card>

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
