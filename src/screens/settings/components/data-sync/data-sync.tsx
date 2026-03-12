import React from 'react';
import { ActionSheetIOS, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { useSettingsValue, useEntitlement, useFeatureGate } from '@hooks';
import useLoading from './use-loading';
import { shareDbBackup, restoreFromDbBackup, shareCsvExport, restoreFromCsvBackup } from '@lib/backup';

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

const DataSync = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { tier } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const { withLoading, loadingAction, isLoading } = useLoading();
	const accent = useSettingsValue<UserT['accent']>('accent');
	const accentColor = theme.accents[accent];

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
				<CardRow disabled style={{ opacity: 0.45 }}>
					<CardRowTitle>{t('settings.data.icloud_sync')}</CardRowTitle>
					<CardRowValue>{t('settings.data.icloud_coming_soon')}</CardRowValue>
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
