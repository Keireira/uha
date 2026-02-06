import styled from 'styled-components/native';

import { Text } from '@ui';

export const Title = styled(Text)`
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Rule = styled.View`
	flex: 1;
	height: 1px;
	background-color: ${({ theme }) => theme.border.default};
	opacity: 0.3;
`;

export const HeaderLink = styled.Pressable`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export default styled.View`
	gap: 16px;
`;
