import styled from 'styled-components/native';
import { LargeText } from '@ui';

export const EmptyLogo = styled.View`
	width: 32px;
	height: 32px;
	background-color: rgba(72, 72, 74, 0.2);
	border-radius: 12px;
`;

export const DayNumber = styled(LargeText).attrs({
	$weight: 600,
	$color: '#fafafa',
	$align: 'center'
})``;

export const LogoContainer = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

export const OverflowBadge = styled.View`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 60%;
	height: 110%;
	background-color: #2c2c2e;
	background-color: #6d28d9;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	transform: rotate(45deg) translateY(4px);
	transform-origin: center;
`;

export default styled.View<{ $isEmpty: boolean }>`
	flex: 1;
	aspect-ratio: 1 / 1.5;
	margin: 2px;
	border-radius: 12px;
	background-color: ${({ $isEmpty }) => ($isEmpty ? 'rgba(52, 52, 52, 0.2)' : '#2c2c2e')};
	padding: 6px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 4px;
`;
