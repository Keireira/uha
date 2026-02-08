import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const HeroSection = styled.View`
	align-items: center;
	gap: 16px;
	margin-top: 12px;
`;

/* Accent ring — the hero IS the accent */
export const HeroRing = styled.View<{ $color: string }>`
	width: 88px;
	height: 88px;
	border-radius: 26px;
	border-width: 2.5px;
	border-color: ${({ $color }) => $color};
	opacity: 0.85;
	align-items: center;
	justify-content: center;
`;

export const HeroGlass = styled(GlassView)`
	width: 76px;
	height: 76px;
	border-radius: 21px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export const HeroEmoji = styled(BaseText)`
	font-size: 38px;
	line-height: 76px;
	text-align: center;
`;

export const HeroTitle = styled(BaseText)`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

export const HeroComment = styled(BaseText)`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

export const MetaGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 32px;
`;

export const MetaItem = styled.View`
	flex-direction: column;
	gap: 6px;
	min-width: 100px;
`;

export const MetaValue = styled(BaseText)`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const Label = styled(BaseText)`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.secondary};
`;

export const CountBadge = styled(BaseText)`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 2px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const LabelRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
`;

export const SubscriptionRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 14px;
	padding-vertical: 10px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}15`};
`;

export const SubscriptionInfo = styled.View`
	flex: 1;
	flex-direction: column;
	gap: 2px;
`;

export const SubscriptionName = styled(BaseText)`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const SubscriptionMeta = styled(BaseText)`
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const SubscriptionPrice = styled(BaseText)`
	font-size: 15px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.secondary};
	text-align: right;
`;

export const EmptyHint = styled(BaseText)`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
	margin-top: 8px;
`;

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		paddingTop: 48,
		paddingHorizontal: 24,
		paddingBottom: 36
	}
})``;
