import React, { useState } from 'react';

import { useSettingsValue } from '@hooks';
import { backfillRates } from '@hooks/setup';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { H5 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import Root, { Inner } from './refresh-button.styles';

import type { UserT } from '@models';

const RefreshButton = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const selectedAccent = useSettingsValue<UserT['accent']>('accent');
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefreshRates = async () => {
		setIsRefreshing(true);

		try {
			await backfillRates();

			Toast.show({
				type: 'success',
				text1: t('rates.success_title')
			});
		} catch {
			Toast.show({
				type: 'error',
				text1: t('rates.error_title'),
				text2: t('rates.error_description')
			});
		} finally {
			setIsRefreshing(false);
		}
	};

	return (
		<Root $disabled={isRefreshing} isInteractive={!isRefreshing}>
			<Inner disabled={isRefreshing} onPress={handleRefreshRates}>
				<SymbolView name="arrow.clockwise" size={15} weight="semibold" tintColor={theme.accents[selectedAccent]} />

				<H5 $color={theme.accents[selectedAccent]}>{t('settings.currencies.refresh_rates')}</H5>
			</Inner>
		</Root>
	);
};

export default RefreshButton;
