import styled from 'styled-components/native';

export const WeekdayRow = styled.View`
	flex-direction: row;
	margin-bottom: 8px;
`;

export const WeekdayCell = styled.View`
	flex: 1;
	aspect-ratio: 1;
	align-items: center;
	justify-content: center;
	background-color: #3a3a3c;
	border-radius: 12px;
	margin: 2px;
`;

export const CalendarGrid = styled.View`
	flex: 1;
`;

export const WeekRow = styled.View`
	flex-direction: row;
`;

export const Header = styled.View`
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 8px;
`;

export default styled.View`
	flex: 1;
	background-color: #1c1c1e;
	padding: 16px;
`;
