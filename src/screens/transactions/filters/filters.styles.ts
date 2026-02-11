import styled from 'styled-components/native';
import { Text } from '@ui';

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
	background-color: ${({ theme, $selected }) => ($selected ? theme.accent.orange : 'transparent')};
	border-width: ${({ $selected }) => ($selected ? '0px' : '1.5px')};
	border-color: ${({ theme, $implied }) => ($implied ? `${theme.accent.orange}90` : `${theme.text.secondary}30`)};
`;

export const ImpliedDot = styled.View`
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background-color: ${({ theme }) => `${theme.accent.orange}70`};
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

export const EmptyText = styled(Text)`
	font-size: 15px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const EmptyState = styled.View`
	align-items: center;
	justify-content: center;
	padding: 48px 0;
`;

export const Content = styled.ScrollView.attrs({
	automaticallyAdjustKeyboardInsets: true,
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	contentContainerStyle: {
		paddingTop: 136,
		paddingRight: 24,
		paddingBottom: 24,
		paddingLeft: 24
	}
})`
	flex: 1;
`;

export default styled.View`
	flex: 1;
`;
