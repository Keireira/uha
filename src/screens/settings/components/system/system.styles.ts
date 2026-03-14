import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text, SmallText } from '@ui';

export const Subtitle = styled(SmallText)`
	margin-top: 2px;
	font-weight: 500;
`;

export const Title = styled(Text)`
	font-weight: 600;
	letter-spacing: 0.2px;
	color: ${({ theme }) => theme.text.secondary};
`;

export const Inner = styled.Pressable`
	gap: 4px;
	padding: 16px;
`;

export default styled(GlassView)`
	flex: 1;
	overflow: hidden;
	border-radius: 16px;
`;
