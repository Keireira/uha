import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const UpgradeBanner = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accents.orange}10`};
	border-width: 1px;
	border-color: ${({ theme }) => `${theme.accents.orange}30`};
`;

export const UpgradeBannerInner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 16px;
	gap: 12px;
`;

export const UpgradeBannerText = styled.View`
	flex: 1;
	gap: 2px;
`;

export const UpgradeBannerTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 700;
	color: ${({ theme }) => theme.accents.orange};
`;

export const UpgradeBannerSub = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

export const UnlimitedBadge = styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme }) => `${theme.accents.orange}10`};
`;

export const UnlimitedBadgeInner = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 16px;
	gap: 12px;
`;

export const UnlimitedBadgeText = styled.View`
	flex: 1;
	gap: 2px;
`;

export const UnlimitedBadgeTitle = styled(BaseText)`
	font-size: 16px;
	font-weight: 700;
	color: ${({ theme }) => theme.accents.orange};
`;

export const UnlimitedBadgeSub = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;
