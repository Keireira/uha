import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const EditBadge = styled(GlassView)`
	align-items: center;
	justify-content: center;

	position: absolute;
	bottom: -8px;
	left: -8px;

	width: 32px;
	height: 32px;

	border-radius: 25px;
`;

export const LogoPressable = styled.Pressable`
	position: relative;
`;

export default styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;

	gap: 28px;
`;
