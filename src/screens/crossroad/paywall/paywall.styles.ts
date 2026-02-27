import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
`;

export const ScrollContent = styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled' as const
})`
	flex: 1;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 16px 24px 12px;
`;

export const Title = styled(BaseText)`
	font-size: 22px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.primary};
	letter-spacing: -0.3px;
`;

export const Subtitle = styled(BaseText)`
	font-size: 15px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
	padding: 0 24px;
	margin-bottom: 24px;
`;

/* Feature list */
export const FeatureList = styled.View`
	padding: 0 24px;
	gap: 14px;
	margin-bottom: 28px;
`;

export const FeatureRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export const FeatureText = styled(BaseText)`
	font-size: 16px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
`;

/* Price cards */
export const PriceCards = styled.View`
	flex-direction: row;
	padding: 0 24px;
	gap: 10px;
	margin-bottom: 24px;
`;

export const PriceCard = styled(GlassView)<{ $active: boolean }>`
	flex: 1;
	border-radius: 16px;
	overflow: hidden;
	border-width: 2px;
	border-color: ${({ $active, theme }) => ($active ? theme.accent.orange : 'transparent')};
`;

export const PriceCardInner = styled.Pressable`
	align-items: center;
	padding: 16px 8px;
	gap: 6px;
`;

export const PriceCardLabel = styled(BaseText)`
	font-size: 13px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
`;

export const PriceCardPrice = styled(BaseText)`
	font-size: 20px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.primary};
	letter-spacing: -0.3px;
`;

export const PriceCardPeriod = styled(BaseText)`
	font-size: 11px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const BestValueBadge = styled.View`
	background-color: ${({ theme }) => theme.accent.orange};
	border-radius: 6px;
	padding: 2px 8px;
	margin-bottom: 4px;
`;

export const BestValueText = styled(BaseText)`
	font-size: 10px;
	font-weight: 700;
	color: #ffffff;
	text-transform: uppercase;
`;

/* Action buttons */
export const ActionArea = styled.View`
	padding: 0 24px;
	gap: 12px;
	margin-bottom: 16px;
`;

export const SubscribeButton = styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
	background-color: ${({ theme }) => theme.accent.orange};
`;

export const SubscribeButtonInner = styled.Pressable`
	align-items: center;
	justify-content: center;
	padding: 16px;
`;

export const SubscribeButtonText = styled(BaseText)`
	font-size: 17px;
	font-weight: 700;
	color: #ffffff;
`;

export const RestoreButton = styled.Pressable`
	align-items: center;
	padding: 12px;
`;

export const RestoreText = styled(BaseText)`
	font-size: 14px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.secondary};
`;

/* Footer note */
export const FooterNote = styled(BaseText)`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.tertiary};
	text-align: center;
	padding: 0 32px;
	margin-bottom: 8px;
	line-height: 17px;
`;
