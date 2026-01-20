import styled from 'styled-components/native';
import { H5 } from '@ui';

export const MonthHeader = styled(H5)`
	margin-bottom: 4px;
`;

export const DaysGrid = styled.View`
	flex: 1;
	flex-direction: row;
	flex-wrap: wrap;
`;

export const MonthCard = styled.Pressable<{ $isMonthInRange: boolean }>`
	width: 31%;
	opacity: ${({ $isMonthInRange }) => ($isMonthInRange ? 1 : 0.444)};
`;
