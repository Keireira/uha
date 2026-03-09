import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

// import usePaywall from './use-paywall';
import { useEntitlement, useSettingsValue, useFeatureGate } from '@hooks';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Inner, TextView } from './unlimited.styles';

import type { UserT } from '@models';

const Unlimited = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { isUnlimited } = useEntitlement();
	const openFeatureGate = useFeatureGate();
	const accent = useSettingsValue<UserT['accent']>('accent');

	return (
		<Root $accent={accent} isInteractive={!isUnlimited}>
			<Inner disabled={isUnlimited} onPress={openFeatureGate}>
				<SymbolView name="crown.fill" size={24} tintColor={theme.accents[accent]} />

				<TextView>
					<H5 $color={theme.accents[accent]}>{t('settings.unlimited.badge')}</H5>

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
