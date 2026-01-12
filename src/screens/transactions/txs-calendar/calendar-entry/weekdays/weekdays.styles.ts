import styled from 'styled-components/native';
import { SmallText } from '@ui';

export const WeekdayText = styled(SmallText)`
	color: #fafafa95;
	font-weight: 600;
	text-transform: uppercase;
`;

export const WeekdayCell = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	margin: 2px;
	padding-vertical: 8px;
`;

export default styled.View`
	flex-direction: row;
	margin-bottom: 8px;
	margin-top: 16px;
`;
