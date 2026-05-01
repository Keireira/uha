import React, { useState } from 'react';

import { useAccent } from '@hooks';
import { backfillRates } from '@hooks/setup';
import { useTranslation } from 'react-i18next';

import { H5 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import Root, { Inner } from './refresh-button.styles';

const RefreshButton = () => {
	const { t } = useTranslation();
	const accentColor = useAccent();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefreshRates = async () => {
		setIsRefreshing(true);

		try {
			await backfillRates({ refetchExisting: true });

			Toast.show({
				type: 'success',
				text1: t('rates.success.title')
			});
		} catch {
			Toast.show({
				type: 'error',
				text1: t('rates.error.title'),
				text2: t('rates.error.description')
			});
		} finally {
			setIsRefreshing(false);
		}
	};

	return (
		<Root $disabled={isRefreshing} isInteractive={!isRefreshing}>
			<Inner disabled={isRefreshing} onPress={handleRefreshRates}>
				<SymbolView name="arrow.clockwise" size={15} weight="semibold" tintColor={accentColor} />

				<H5 $color={accentColor}>{t('settings.currencies.refresh_rates')}</H5>
			</Inner>
		</Root>
	);
};

export default RefreshButton;
