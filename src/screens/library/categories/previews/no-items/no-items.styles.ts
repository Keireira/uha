import styled from 'styled-components/native';
import { Text } from '@ui';

export const Title = styled(Text)`
	font-size: 18px;
	line-height: 48px;
	color: #33333350;
	text-transform: uppercase;
`;

export default styled.View`
	width: 100%;
	padding: 18px;
	border-radius: 12px;
	border: 1px dashed #33333350;
	background-color: #33333305;
`;
