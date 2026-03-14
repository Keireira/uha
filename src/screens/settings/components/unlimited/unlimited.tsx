import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useEntitlement, useAccent, useFeatureGate } from '@hooks';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Inner, TextView } from './unlimited.styles';

const Unlimited = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const accentColor = useAccent();
	const { isUnlimited } = useEntitlement();
	const openFeatureGate = useFeatureGate();

	return (
		<Root $accentColor={accentColor} isInteractive={!isUnlimited}>
			<Inner disabled={isUnlimited} onPress={() => openFeatureGate()}>
				<SymbolView name="crown.fill" size={24} tintColor={accentColor} />

				<TextView>
					<H5 $color={accentColor}>{t('settings.unlimited.badge')}</H5>

					<SmallText $color={theme.text.secondary}>
						{isUnlimited ? t('settings.unlimited.active') : t('limits.upgrade')}
					</SmallText>
				</TextView>

				{!isUnlimited && (
					<SymbolView name="chevron.right" size={14} weight="semibold" tintColor={theme.text.tertiary} />
				)}
			</Inner>
		</Root>
	);
};

export default Unlimited;
