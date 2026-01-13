import styled from 'styled-components/native';
import { H2 } from '@ui';

export const Title = styled(H2)`
	text-transform: capitalize;
`;

export default styled.View`
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 8px;
	margin-bottom: 16px;
`;
