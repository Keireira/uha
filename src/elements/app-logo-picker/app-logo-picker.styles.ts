import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

export const PressMe = styled.Pressable`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
`;

export const AnimateMe = styled(Animated.View)`
	width: 128px;
	height: 128px;
	position: relative;
`;

export const CheckSF = styled.View`
	width: 28px;
	height: 28px;
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 1;
`;

export default styled(PagerView)`
	flex: 1;
	height: 200px;
`;
