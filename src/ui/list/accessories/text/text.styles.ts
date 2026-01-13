import styled from 'styled-components/native';
import { Text } from '../../../typography';

export const InnerText = styled(Text)`
	text-align: right;
	font-size: 18px;
	color: ${({ theme }) => theme.text.secondary};
`;

export const InnerTextWrap = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 4px;
`;

export const Trigger = styled.Pressable`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 100%;
`;
