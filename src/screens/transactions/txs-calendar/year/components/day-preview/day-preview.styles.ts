import styled from 'styled-components/native';
import { SmallText } from '@ui';

export const Mark = styled.View`
	width: 50%;
	height: 2px;
	background-color: ${({ theme }) => theme.accent.secondary};
	border-radius: 50px;
`;

export const DayNumber = styled(SmallText)<{ $isSelected: boolean; $isInRange: boolean }>`
	color: ${({ $isSelected, $isInRange, theme }) => {
		if (!$isInRange) return theme.text.secondary;
		if ($isSelected) return theme.static.white;

		return theme.text.primary;
	}};
	font-weight: ${({ $isSelected }) => ($isSelected ? '700' : '400')};
`;

export default styled.View<{ $isSelected: boolean; $isInRange: boolean; $isEmpty?: boolean }>`
	width: 14.28%;
	align-items: center;
	justify-content: center;
	opacity: ${({ $isInRange }) => ($isInRange ? 1 : 0.444)};
	${({ $isSelected, theme }) => {
		return $isSelected ? `background-color: ${theme.accent.primary};` : '';
	}};
	border-radius: 50%;
	${({ $isEmpty, theme }) => $isEmpty && `background-color: ${theme.surface.default}30;`};
`;
