import { Text } from '../typography';
import Animated from 'react-native-reanimated';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import styled from 'styled-components/native';

export const Image = styled(AvatarPrimitive.Image)`
	position: absolute;
	top: 0;
	left: 0;
	width: 96px;
	height: 96px;
`;

export const FallbackText = styled(Text)`
	font-size: 32px;
	font-weight: 600;
	color: white;
`;

export default styled(Animated.View)<{ $color?: string }>`
	position: relative;
	height: 96px;
	width: 96px;
	background-color: ${({ $color }) => $color || 'lightblue'};
	border-radius: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;
