import { BlurView } from 'expo-blur';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export const TabButton = styled.Pressable`
	flex: 1;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const CircleRoot = styled.Pressable`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	background-color: ${({ theme }) => theme.surface.navbar};
	border-radius: 50%;
`;

export const BurpView = styled(BlurView)`
	padding: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const Gradient = styled(LinearGradient)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`;

export const GradientRoot = styled(Animated.View)`
	background-color: transparent;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 48px;
`;

export default styled(Animated.View)`
	position: absolute;
	left: 18px;
	right: 18px;
	border-radius: 36px;
	bottom: 18px;
	z-index: 100;
	overflow: hidden;
`;
