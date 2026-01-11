import styled from 'styled-components/native';

export const DayNumber = styled.Text`
	position: absolute;
	bottom: 6px;
	left: 0;
	right: 0;
	text-align: center;
	font-size: 14px;
	color: #ffffff;
	font-family: 'Nunito';
	font-weight: 600;
`;

export const LogoContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export const OverflowBadge = styled.View`
	position: absolute;
	top: 4px;
	right: 4px;
	background-color: #48484a;
	border-radius: 8px;
	padding: 2px 6px;
`;

export default styled.View`
	flex: 1;
	aspect-ratio: 1;
	margin: 2px;
	border-radius: 12px;
	background-color: #2c2c2e;
	padding: 6px;
	position: relative;
`;
