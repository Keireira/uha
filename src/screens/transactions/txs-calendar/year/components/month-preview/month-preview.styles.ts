import styled from 'styled-components/native';
import { H5 } from '@ui';

export const MonthCard = styled.Pressable`
	width: 31%;
	aspect-ratio: 1;
`;

export const MonthHeader = styled(H5)<{ $isInRange: boolean }>`
	color: ${({ $isInRange, theme }) => {
		if (!$isInRange) return theme.text.secondary;

		return theme.text.primary;
	}};
	margin-bottom: 4px;
`;

export const DaysGrid = styled.View`
	flex: 1;
	flex-direction: row;
	flex-wrap: wrap;
`;
