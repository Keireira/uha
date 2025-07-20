import styled from 'styled-components/native';
import { Text } from '@ui';

export const Title = styled(Text)`
	font-size: 16px;
	font-weight: 700;
	text-transform: uppercase;
`;

export default styled.Pressable`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 2px;
`;
