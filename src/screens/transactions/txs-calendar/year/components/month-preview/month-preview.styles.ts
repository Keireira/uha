import styled from 'styled-components/native';
import { H5 } from '@ui';

export const MonthHeader = styled(H5)`
	margin-bottom: 4px;
`;

export const DaysGrid = styled.View`
	flex: 1;
	flex-direction: column;
`;

export const Week = styled.View`
	flex-direction: row;
`;

export default styled.Pressable<{ $isMonthInRange: boolean }>`
	flex: 1;
	opacity: ${({ $isMonthInRange }) => ($isMonthInRange ? 1 : 0.444)};
`;
