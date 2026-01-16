import styled from 'styled-components/native';
import { H2 } from '@ui';

export const Title = styled(H2)`
	text-transform: capitalize;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled.Pressable`
	padding-top: 12px;
	padding-bottom: 12px;
`;
