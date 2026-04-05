import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

export const EmptyText = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const Inner = styled.View`
	align-items: center;
	justify-content: center;
	gap: 28px;
	padding-vertical: 56px;
	padding-horizontal: 28px;
`;

export default styled(GlassView)`
	border-radius: 20px;
	overflow: hidden;
	margin-horizontal: 20px;
`;
