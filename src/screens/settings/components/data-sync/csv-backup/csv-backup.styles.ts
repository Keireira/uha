import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Title = styled.View`
	gap: 10px;
	flex-shrink: 1;
	flex-direction: row;
`;

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	gap: 12px;
`;

export default styled(GlassView)`
	border-radius: 16px;
	overflow: hidden;
`;
