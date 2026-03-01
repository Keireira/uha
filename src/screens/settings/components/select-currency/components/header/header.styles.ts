import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';

export const Title = styled.View`
	position: absolute;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: center;
	gap: 12px;
`;

export const HeaderRow = styled.View`
	position: relative;
	left: 0;
	right: 0;
	height: 42px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

export default styled(BlurView)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	padding: 18px;
	flex-direction: column;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}40`};
`;
