import styled from 'styled-components/native';
import { Text, SmallText } from '@ui';

export const StatusBadge = styled.View<{ $isPhantom?: boolean }>`
	flex-direction: row;
	align-items: center;
	gap: 6px;
	background-color: ${({ $isPhantom, theme }) =>
		$isPhantom ? `${theme.semantic.warning}20` : `${theme.semantic.success}20`};
	padding: 6px 12px;
	border-radius: 8px;
`;

export const StatusDot = styled.View<{ $isPhantom?: boolean }>`
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background-color: ${({ $isPhantom, theme }) => ($isPhantom ? theme.semantic.warning : theme.semantic.success)};
`;

export const Root = styled.ScrollView.attrs({
	contentContainerStyle: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 40,
		gap: 24
	}
})`
	flex: 1;
`;

export const HeroSection = styled.View`
	align-items: center;
	padding-vertical: 24px;
	gap: 12px;
`;

export const AmountContainer = styled.View`
	align-items: center;
	margin-top: 16px;
	gap: 4px;
`;

export const ConvertedAmount = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
	font-weight: 500;
`;

export const CategoryPill = styled.View<{ $color: string }>`
	background-color: ${({ $color }) => `${$color}25`};
	padding: 6px 14px;
	border-radius: 20px;
	margin-top: 4px;
`;

export const DetailCard = styled.View`
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 16px;
	padding: 4px 0;
	overflow: hidden;
`;

export const DetailRow = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 14px 16px;
`;

export const DetailLabel = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
	font-weight: 500;
`;

export const DetailValue = styled(Text)<{ $mono?: boolean }>`
	color: ${({ theme }) => theme.text.primary};
	font-weight: 600;
	font-family: ${({ $mono }) => ($mono ? 'monospace' : 'Nunito')};
`;

export const CurrencyBadge = styled.View`
	background-color: ${({ theme }) => theme.accent.primary}25;
	padding: 4px 10px;
	border-radius: 8px;
`;

export const Divider = styled.View`
	height: 0.5px;
	background-color: ${({ theme }) => `${theme.border.default}60`};
	margin-left: 16px;
`;
