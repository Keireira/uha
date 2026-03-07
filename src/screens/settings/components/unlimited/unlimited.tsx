import React from 'react';

import { useRouter } from 'expo-router';
import { useEntitlement } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import {
	UnlimitedBadge,
	UnlimitedBadgeInner,
	UnlimitedBadgeText,
	UnlimitedBadgeTitle,
	UnlimitedBadgeSub,
	UpgradeBanner,
	UpgradeBannerInner,
	UpgradeBannerText,
	UpgradeBannerTitle,
	UpgradeBannerSub
} from './unlimited.styles';
import { SymbolView } from 'expo-symbols';

const Unlimited = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const { isUnlimited } = useEntitlement();

	if (isUnlimited) {
		return (
			<UnlimitedBadge>
				<UnlimitedBadgeInner>
					<SymbolView name="crown.fill" size={24} tintColor={theme.accents.orange} />

					<UnlimitedBadgeText>
						<UnlimitedBadgeTitle>{t('settings.unlimited.badge')}</UnlimitedBadgeTitle>
						<UnlimitedBadgeSub>{t('settings.unlimited.active')}</UnlimitedBadgeSub>
					</UnlimitedBadgeText>
				</UnlimitedBadgeInner>
			</UnlimitedBadge>
		);
	}

	return (
		<UpgradeBanner>
			<UpgradeBannerInner onPress={() => router.push('/(crossroad)/paywall')}>
				<SymbolView name="crown.fill" size={24} tintColor={theme.accents.orange} />

				<UpgradeBannerText>
					<UpgradeBannerTitle>{t('settings.unlimited.badge')}</UpgradeBannerTitle>
					<UpgradeBannerSub>{t('limits.upgrade')}</UpgradeBannerSub>
				</UpgradeBannerText>

				<SymbolView name="chevron.right" size={14} weight="semibold" tintColor={theme.text.tertiary} />
			</UpgradeBannerInner>
		</UpgradeBanner>
	);
};

export default Unlimited;
