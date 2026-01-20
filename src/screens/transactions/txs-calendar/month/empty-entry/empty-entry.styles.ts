import styled from 'styled-components/native';
import { H2 } from '@ui';

export const EmptyText = styled(H2)`
	color: ${({ theme }) => theme.text.secondary};
`;

export default styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 111px;
	flex: 1;
`;
