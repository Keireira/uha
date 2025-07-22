import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const AnimateMe = styled(Animated.View)`
	transform: scale(1);
	align-self: center;
	width: 84px;
	height: 84px;
	overflow: hidden;
	border-radius: 24px;
`;

export default styled.Pressable`
	display: flex;
	align-items: center;
	justify-content: center;

	flex: 1;
	background-color: #33333310;
`;
