import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Inner = styled.View<{ $color: string }>`
	padding: 3px 8px;
	background-color: ${({ $color }) => `${$color}10`};
`;

export default styled(GlassView)`
	border-radius: 8px;
	overflow: hidden;
`;
