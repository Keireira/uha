import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export default styled(Animated.View)<{ $color: string; $active: boolean }>`
	height: 100%;
	border-radius: 10px;
	background-color: ${({ $color }) => $color};
	overflow: hidden;
	border-width: 2.5px;
	border-color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.45)' : 'transparent')};
	shadow-color: ${({ $color }) => $color};
	shadow-offset: 0px 2px;
	shadow-opacity: ${({ $active }) => ($active ? 0.5 : 0)};
	shadow-radius: 6px;
	elevation: ${({ $active }) => ($active ? 6 : 0)};
`;
