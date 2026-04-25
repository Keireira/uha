import styled from 'styled-components/native';
import { Text } from '@ui';

export const EmptyText = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;

export default styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	gap: 28px;
	padding-vertical: 64px;
	padding-horizontal: 32px;
`;
