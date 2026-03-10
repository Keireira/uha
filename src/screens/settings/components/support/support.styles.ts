import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	padding: 12px 16px;
	gap: 8px;
`;

export const Pill = styled(GlassView).attrs({
	isInteractive: true
})<{ $color: string }>`
	overflow: hidden;
	border-radius: 14px;
	background-color: ${({ $color }) => `${$color}12`};
`;

export default styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 8px;
`;
