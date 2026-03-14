import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Inner = styled.Pressable`
	align-items: flex-start;
	padding: 14px 16px;
	gap: 12px;
`;

export const Tile = styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
	flex: 1;
`;

export default styled.View`
	margin-vertical: 10px;
	flex-direction: row;
	gap: 10px;
`;
