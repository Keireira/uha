import styled from 'styled-components/native';
import { Text } from '@ui';

export const SectionHeader = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	padding: 12px 4px 8px;
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 12px;
	padding-horizontal: 12px;
	margin-bottom: 8px;
`;

export const SectionTitle = styled(Text)`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

export const Grid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 8px;
`;

export const SymbolCell = styled.Pressable<{ $selected: boolean; $color: string }>`
	align-items: center;
	justify-content: center;
	background-color: ${({ $selected, $color, theme }) => ($selected ? $color : theme.surface.secondary)};
`;
