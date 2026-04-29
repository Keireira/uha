import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

import { BaseText, Text } from '@ui';

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	contentContainerStyle: {
		paddingBottom: 48
	}
})`
	flex: 1;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 22px 18px 12px;
	gap: 12px;
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
	font-size: 23px;
	font-weight: 700;
	text-align: center;
	color: ${({ theme }) => theme.text.primary};
`;

export const TabBarRow = styled.View`
	z-index: 2;
	margin-bottom: 18px;
	flex-grow: 0;
	display: flex;
	gap: 12px;
	padding-horizontal: 18px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
`;

export const TabGlass = styled(GlassView)<{ $active: boolean }>`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.accents.orange}20` : 'transparent')};
	border-width: ${({ $active }) => ($active ? '0px' : '1px')};
	border-color: ${({ theme }) => `${theme.border.default}40`};
`;

export const TabInner = styled.Pressable`
	padding-horizontal: 18px;
	padding-vertical: 10px;
`;

export const TabLabel = styled(Text)<{ $active: boolean }>`
	font-size: 16px;
	font-weight: ${({ $active }) => ($active ? '600' : '500')};
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
`;

export const ChartCard = styled.View`
	z-index: 1;
	margin: 0 18px 22px;
	padding: 18px 0;
	border-radius: 28px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.surface.default};
	shadow-color: ${({ theme }) => theme.shadow.default};
	shadow-opacity: 0.08;
	shadow-radius: 18px;
	shadow-offset: 0px 8px;
`;

export const ChartFrame = styled.View`
	width: 100%;
	max-width: 256px;
	aspect-ratio: 1;
	align-items: center;
	justify-content: center;
`;

export const ChartCenterLabel = styled.View`
	position: absolute;
	width: 96px;
	align-items: center;
	justify-content: center;
`;

export const ChartTotal = styled(BaseText)`
	margin-top: 4px;
	font-size: 26px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
	text-align: center;
`;

export const BreakdownSection = styled.View`
	padding: 0 18px;
`;

export const BreakdownSectionTitle = styled(Text)<{ $withTopMargin: boolean }>`
	margin-top: ${({ $withTopMargin }) => ($withTopMargin ? '18px' : '0px')};
	margin-bottom: 6px;
	padding-left: 2px;
	font-size: 15px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.secondary};
`;

export const BreakdownItem = styled.Pressable`
	min-height: 64px;
	flex-direction: row;
	align-items: center;
	gap: 14px;
	padding-vertical: 8px;
`;

export const CategoryBadge = styled.View<{ $color: string }>`
	width: 46px;
	height: 46px;
	border-radius: 23px;
	align-items: center;
	justify-content: center;
	background-color: ${({ $color }) => `${$color}55`};
`;

export const CategoryEmoji = styled(Text)`
	font-size: 23px;
	text-align: center;
`;

export const BreakdownTextGroup = styled.View`
	flex: 1;
	min-width: 0px;
`;

export const BreakdownTitle = styled(BaseText)`
	font-size: 20px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const BreakdownSubtitle = styled(Text)`
	margin-top: 2px;
	font-size: 16px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

export const BreakdownAmount = styled(BaseText)`
	max-width: 136px;
	font-size: 20px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
	text-align: right;
`;
