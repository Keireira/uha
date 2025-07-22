import styled from 'styled-components/native';

import { Text } from '@ui';

export const Title = styled(Text)`
	font-size: 16px;
	font-weight: 700;
	text-transform: uppercase;
`;

export const HeaderLink = styled.Pressable`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 2px;
`;

export default styled.View`
	gap: 12px;
`;
