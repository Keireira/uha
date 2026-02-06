import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Text } from '@ui';

export const Label = styled(Text)`
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const AnimateMe = styled(Animated.View)`
	transform: scale(1);
	align-self: center;
`;

export default styled.Pressable`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 88px;
	width: 88px;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${({ theme }) => `${theme.border.default}30`};
`;
