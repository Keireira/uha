import styled from 'styled-components/native';
import { GlassView, GlassContainer } from 'expo-glass-effect';
import { Text } from '@ui';

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
`;

export const TitleRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 10px;
`;

export const AccentRule = styled.View`
	height: 2px;
	background-color: ${({ theme }) => theme.accent.primary};
	margin-bottom: 20px;
	border-radius: 1px;
	opacity: 0.3;
`;

export const Title = styled(Text)`
	font-size: 24px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.primary};
	letter-spacing: -0.4px;
`;

export const CountGlass = styled(GlassView)`
	border-radius: 10px;
	min-width: 24px;
	align-items: center;
	overflow: hidden;
	padding: 2px 9px;
	background-color: ${({ theme }) => theme.accent.primary};
`;

export const CountText = styled(Text)`
	font-size: 13px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.inverse};
`;

export const ClearGlass = styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
	padding: 6px 14px;
	background-color: ${({ theme }) => `${theme.text.secondary}18`};
`;

export const ClearButtonText = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
`;

export const TimeModeGlassGroup = styled(GlassContainer)`
	margin-bottom: 20px;
`;

export const TimeModeRow = styled.View`
	flex-direction: row;
	gap: 6px;
`;

export const TimeModeGlass = styled(GlassView)<{ $active: boolean }>`
	flex: 1;
	border-radius: 12px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.text.primary}10` : 'transparent')};
`;

export const TimeModeInner = styled.Pressable`
	align-items: center;
	padding-vertical: 10px;
`;

export const TimeModeLabel = styled(Text)<{ $active: boolean }>`
	font-size: 14px;
	font-weight: ${({ $active }) => ($active ? '700' : '500')};
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
`;

export const TabBarRow = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 6
	}
})`
	margin-bottom: 20px;
	flex-grow: 0;
`;

export const TabGlass = styled(GlassView)<{ $active: boolean }>`
	border-radius: 20px;
	overflow: hidden;
	background-color: ${({ theme, $active }) => ($active ? `${theme.accent.primary}20` : 'transparent')};
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

export const ItemsSection = styled.View``;

export const ItemPressable = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding-vertical: 13px;
	gap: 14px;
`;

export const CheckCircle = styled.View<{ $selected: boolean; $implied: boolean }>`
	width: 24px;
	height: 24px;
	border-radius: 12px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme, $selected }) => ($selected ? theme.accent.primary : 'transparent')};
	border-width: ${({ $selected }) => ($selected ? '0px' : '1.5px')};
	border-color: ${({ theme, $implied }) => ($implied ? `${theme.accent.primary}90` : `${theme.text.secondary}30`)};
`;

export const ImpliedDot = styled.View`
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background-color: ${({ theme }) => `${theme.accent.primary}70`};
`;

export const ItemTextGroup = styled.View`
	flex: 1;
	gap: 2px;
`;

export const ItemTitle = styled(Text)<{ $hasSubtitle: boolean }>`
	font-size: ${({ $hasSubtitle }) => ($hasSubtitle ? '16px' : '17px')};
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
`;

export const ItemSubtitle = styled(Text)`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
`;

export const DimWrapper = styled.View<{ $dimmed: boolean }>`
	opacity: ${({ $dimmed }) => ($dimmed ? 0.3 : 1)};
`;

export const ItemSeparator = styled.View`
	height: 0.5px;
	background-color: ${({ theme }) => theme.border.default};
	opacity: 0.25;
	margin-left: 38px;
`;

export const EligibilityDivider = styled.View`
	height: 0.5px;
	background-color: ${({ theme }) => theme.border.default};
	opacity: 0.5;
	margin-vertical: 8px;
	margin-horizontal: 24px;
`;

export const EmptyState = styled.View`
	align-items: center;
	justify-content: center;
	padding: 48px 0;
`;

export const EmptyText = styled(Text)`
	font-size: 15px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export default styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentContainerStyle: {
		paddingTop: 24,
		paddingRight: 24,
		paddingBottom: 24,
		paddingLeft: 24
	}
})`
	flex: 1;
`;
