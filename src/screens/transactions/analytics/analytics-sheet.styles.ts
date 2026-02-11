import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

import { BaseText, H2, Text } from '@ui';

export default styled.ScrollView`
	flex: 1;
	padding: 24px 16px;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	padding-horizontal: 24px;
	margin-bottom: 12px;
`;

export const CloseGlass = styled(GlassView)`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	overflow: hidden;
`;

export const CloseInner = styled.Pressable`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

export const Title = styled(BaseText)`
	flex: 1;
	font-size: 22px;
	font-weight: 700;
	text-align: center;
	color: ${({ theme }) => theme.text.primary};
`;

export const TabBarRow = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		paddingHorizontal: 24,
		gap: 6
	}
})`
	margin-bottom: 20px;
	flex-grow: 0;
`;

export const TabGlass = styled(GlassView)<{ $active: boolean }>`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.accent.orange}20` : 'transparent')};
	border-width: ${({ $active }) => ($active ? '0px' : '1px')};
	border-color: ${({ theme }) => `${theme.border.default}40`};
`;

export const TabInner = styled.Pressable`
	padding-horizontal: 16px;
	padding-vertical: 9px;
`;

export const TabLabel = styled(Text)<{ $active: boolean }>`
	font-size: 15px;
	font-weight: ${({ $active }) => ($active ? '700' : '500')};
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
	letter-spacing: 0.2px;
`;

export const ChartSection = styled.View`
	align-items: center;
	margin-bottom: 32px;
`;

export const CenterLabel = styled.View`
	align-items: center;
	justify-content: center;
`;

export const TotalText = styled(H2)`
	text-align: center;
`;

export const LegendSection = styled.View`
	gap: 12px;
`;

export const LegendItem = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export const LegendColorDot = styled.View<{ $color: string }>`
	width: 12px;
	height: 12px;
	border-radius: 6px;
	background-color: ${({ $color }) => $color};
`;

export const LegendEmoji = styled(Text)`
	font-size: 24px;
	width: 32px;
	text-align: center;
`;

export const LegendTextGroup = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const LegendTitle = styled(Text)``;

export const LegendAmount = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;
