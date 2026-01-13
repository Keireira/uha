import styled from 'styled-components/native';
import { H2, Text } from '@ui';

export const Subtitle = styled(Text)`
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Title = styled(H2)`
	text-transform: capitalize;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled.View`
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 8px;
	margin-bottom: 16px;
`;
