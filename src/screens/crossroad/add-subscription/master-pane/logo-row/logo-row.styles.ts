import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';

export const LogoPressable = styled.Pressable`
	position: relative;
`;

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

export const SideSlot = styled.View`
	align-items: center;
	justify-content: center;

	width: 48px;
	height: 48px;
`;

export const SideButton = styled(GlassView)`
	width: 48px;
	height: 48px;

	overflow: hidden;
	border-radius: 25px;
`;

export const FillPress = styled.Pressable`
	align-items: center;
	justify-content: center;

	width: 100%;
	height: 100%;
`;

export default styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;

	gap: 28px;
`;
