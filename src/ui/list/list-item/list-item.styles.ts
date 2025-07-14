import styled from 'styled-components/native';
import { Text } from '../../typography';

export const ListItemRight = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

export const ListItemTitle = styled(Text)`
	font-size: 18px;
	color: #000;
	font-weight: 400;
`;

export const ListItemLeft = styled.View`
	flex-direction: row;
	align-items: center;
	flex: 1;
	min-width: 50%;
`;

export const ListItemContent = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export default styled.TouchableHighlight`
	flex-direction: row;
	align-items: center;
	padding-vertical: 12px;
	padding-horizontal: 16px;
	background-color: white;
	height: 50px;
`;
