import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const Inner = styled.Pressable`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 13px 20px;
	gap: 8px;
`;

export default styled(GlassView)<{ $disabled: boolean }>`
	border-radius: 14px;
	overflow: hidden;
	margin-top: 10px;

	opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
`;
