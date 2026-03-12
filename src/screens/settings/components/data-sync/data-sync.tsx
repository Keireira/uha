import React from 'react';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { useSettingsValue, useEntitlement, useFeatureGate } from '@hooks';
import useLoading from './use-loading';
import useICloud from './use-icloud';
import {
	shareDbBackup,
	restoreFromDbBackup,
	shareCsvExport,
	restoreFromCsvBackup,
	backupToCloudKit,
	restoreFromCloudKit
} from '@lib/backup';

import { H5 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
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

const formatLastBackup = (timestamp: number | null, t: (key: string) => string): string => {
	if (timestamp == null) return t('settings.data.icloud_no_backup');

	const now = Date.now();
	const diff = now - timestamp;
	const minutes = Math.floor(diff / 60_000);
	const hours = Math.floor(diff / 3_600_000);
	const days = Math.floor(diff / 86_400_000);

	if (minutes < 1) return t('settings.data.icloud_just_now');
	if (minutes < 60) return t('settings.data.icloud_minutes_ago').replace('{{count}}', String(minutes));
	if (hours < 24) return t('settings.data.icloud_hours_ago').replace('{{count}}', String(hours));
	return t('settings.data.icloud_days_ago').replace('{{count}}', String(days));
};

const DataSync = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const { withLoading, loadingAction, isLoading } = useLoading();
	const { status: icloudStatus, lastBackup, refresh: refreshICloud } = useICloud();
	const accent = useSettingsValue<UserT['accent']>('accent');
	const accentColor = theme.accents[accent];

	const icloudAvailable = icloudStatus === 'available';
	const icloudChecking = icloudStatus === 'checking';
	const icloudBusy = loadingAction === 'icloud_backup' || loadingAction === 'icloud_restore';

	const getICloudStatusText = () => {
		if (icloudChecking) return t('settings.data.icloud_checking');
		if (!icloudAvailable) return t('settings.data.icloud_unavailable');
		if (icloudBusy) {
			return loadingAction === 'icloud_backup'
				? t('settings.data.icloud_backing_up')
				: t('settings.data.icloud_restoring');
		}
		return formatLastBackup(lastBackup, t);
	};

	const handleICloudPress = () => {
		if (isLoading || icloudChecking) return;

		if (!icloudAvailable) {
			openSettings();
			return;
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
			await backupToCloudKit();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.icloud_backup_success') });
			refreshICloud();
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.icloud_backup_error') });
		}
	});

	const restoreICloudBackup = withLoading('icloud_restore', async () => {
		try {
			const ok = await restoreFromCloudKit();

			if (ok) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				Toast.show({ type: 'success', text1: t('settings.data.icloud_restore_success') });
			} else {
				Toast.show({ type: 'info', text1: t('settings.data.icloud_no_backup') });
			}
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.icloud_restore_error') });
		}
	});

	const createDbBackup = withLoading('db_backup', async () => {
		try {
			await shareDbBackup();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.backup_success') });
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.backup_error') });
		}
	});

	const restoreDbBackup = withLoading('db_restore', async () => {
		try {
			const ok = await restoreFromDbBackup();

			if (ok) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				Toast.show({ type: 'success', text1: t('settings.data.restore_success') });
			}
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.restore_error') });
		}
	});

	const createCsvBackup = withLoading('csv_export', async () => {
		if (!tier.csvExport) {
			return openFeatureGate();
		}

		try {
			await shareCsvExport();

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			Toast.show({ type: 'success', text1: t('settings.data.export_success') });
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.export_error') });
		}
	});

	const restoreCsvBackup = withLoading('csv_import', async () => {
		if (!tier.csvExport) {
			return openFeatureGate();
		}

		try {
			const ok = await restoreFromCsvBackup();

			if (ok) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				Toast.show({ type: 'success', text1: t('settings.data.import_success') });
			}
		} catch {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Toast.show({ type: 'error', text1: t('settings.data.import_error') });
		}
	});

	const openCsvMenu = () => {
		if (isLoading) return;

		if (!tier.csvExport) {
			return openFeatureGate();
		}

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

	return (
		<>
			{/* iCloud */}
			<Card>
				<CardRow disabled={icloudChecking || isLoading} onPress={handleICloudPress}>
					<CardRowTitle>{t('settings.data.icloud_sync')}</CardRowTitle>
					{icloudBusy ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<CardRowValue>{getICloudStatusText()}</CardRowValue>
					)}
				</CardRow>
			</Card>

			{/* Backup / Restore */}
			<TileRow>
				<Tile isInteractive={!isLoading}>
					<TileInner
						disabled={isLoading}
						onPress={createDbBackup}
						style={isLoading && loadingAction !== 'db_backup' ? { opacity: 0.4 } : undefined}
					>
						{loadingAction === 'db_backup' ? (
							<ActivityIndicator size="small" color={accentColor} style={{ alignSelf: 'flex-start' }} />
						) : (
							<SymbolView name="arrow.up.doc" size={20} tintColor={accentColor} />
						)}
						<TileTitle>{t('settings.data.backup')}</TileTitle>
					</TileInner>
				</Tile>

				<Tile isInteractive={!isLoading}>
					<TileInner
						disabled={isLoading}
						onPress={restoreDbBackup}
						style={isLoading && loadingAction !== 'db_restore' ? { opacity: 0.4 } : undefined}
					>
						{loadingAction === 'db_restore' ? (
							<ActivityIndicator size="small" color={accentColor} style={{ alignSelf: 'flex-start' }} />
						) : (
							<SymbolView name="arrow.down.doc" size={20} tintColor={accentColor} />
						)}
						<TileTitle>{t('settings.data.restore')}</TileTitle>
					</TileInner>
				</Tile>
			</TileRow>

			{/* CSV */}
			<CsvButton $disabled={isLoading} isInteractive={!isLoading}>
				<CsvButtonInner disabled={isLoading} onPress={openCsvMenu}>
					{loadingAction === 'csv_export' || loadingAction === 'csv_import' ? (
						<ActivityIndicator size="small" color={accentColor} />
					) : (
						<>
							<SymbolView name="tablecells" size={15} weight="semibold" tintColor={accentColor} />
							<H5 $color={accentColor}>CSV</H5>
						</>
					)}
				</CsvButtonInner>
			</CsvButton>
		</>
	);
};

export default DataSync;
