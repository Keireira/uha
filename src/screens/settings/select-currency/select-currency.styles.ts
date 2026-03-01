import styled from 'styled-components/native';
import { Text, SmallText } from '@ui';

export const SectionHeaderText = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	padding: 16px 6px 6px;
`;

export const CurrencyRow = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 12px 24px;
	gap: 14px;
`;

export const CurrencyInfo = styled.View`
	flex: 1;
	gap: 2px;
`;

export const CurrencyName = styled(Text)<{ $isSelected: boolean }>`
	font-size: 16px;
	font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
	color: ${({ $isSelected, theme }) => ($isSelected ? theme.accent.orange : theme.text.primary)};
`;

export const CurrencyCode = styled(SmallText)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Separator = styled.View`
	height: 0.5px;
	margin-left: 24px;
	background-color: ${({ theme }) => `${theme.border.default}50`};
`;

export const VerticalSpacer = styled.View<{ $height: number }>`
	height: ${({ $height }) => $height}px;
`;

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
	padding-horizontal: 24px;
`;

export default styled.View.attrs({ collapsable: false })`
	flex: 1;
`;
