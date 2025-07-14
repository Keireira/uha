import styled from 'styled-components/native';
import { Text } from '../../../typography';

export const TriggerText = styled(Text)`
	text-align: right;
	font-size: 18px;
	color: #666;
`;

export const Trigger = styled.Pressable`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 100%;
`;
