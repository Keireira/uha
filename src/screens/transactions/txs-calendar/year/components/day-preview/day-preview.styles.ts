import styled from 'styled-components/native';
import { Text } from '@ui';

export const Mark = styled.View<{ $isSelected: boolean }>`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 16px;
	aspect-ratio: 1 / 1;
	background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.accent.primary : theme.accent.secondary)};
	border-radius: 50px;
	transform: translateX(-8px) translateY(-8px);
`;

export const DayNumber = styled(Text)<{ $isSelected: boolean; $withTransactions: boolean }>`
	text-align: center;
	color: ${({ $isSelected, $withTransactions, theme }) => {
		if ($isSelected || $withTransactions) return theme.static.white;

		return theme.text.primary;
	}};
`;

export default styled.View<{ $isEmpty?: boolean }>`
	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;

	flex: 1;
	aspect-ratio: 1 / 1;
	margin: 2px;

	${({ $isEmpty, theme }) => $isEmpty && `background-color: ${theme.surface.default}30;`};
`;
