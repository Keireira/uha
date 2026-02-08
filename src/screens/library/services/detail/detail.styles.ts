import styled from 'styled-components/native';
import { BaseText } from '@ui';

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
	padding-vertical: 20px;
`;

export const HeroSection = styled.View`
	align-items: center;
	gap: 16px;
`;

export const LogoWrapper = styled.View<{ $color: string }>`
	width: 72px;
	height: 72px;
	border-radius: 20px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
	background-color: ${({ $color }) => `${$color}10`};
`;

export const HeroTitle = styled(BaseText)`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

export const CategoryBadge = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 6px;
`;

export const CategoryEmoji = styled(BaseText)`
	font-size: 16px;
`;

export const CategoryName = styled(BaseText)`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
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
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingTop: 48,
		paddingRight: 24,
		paddingBottom: 36,
		paddingLeft: 20
	}
})``;
