import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const Star = styled(Animated.View)`
	position: absolute;
	z-index: 10;
`;

export const Dot = styled.View<{ $color: string }>`
	background-color: ${({ theme, $color }) => `${$color}${theme.is_oled ? 'FF' : 'AA'}`};
	border-radius: 50%;
	shadow-color: ${({ $color }) => $color};
	shadow-offset: 0px 0px;
	shadow-opacity: 0.8;
	shadow-radius: 6px;
`;

export const DotWrapper = styled.Pressable`
	position: absolute;
	z-index: 5;
`;

export const Glow = styled(Animated.View)`
	position: absolute;
	align-items: center;
	justify-content: center;
	z-index: 3;
`;

export const Ray = styled.View<{ $color: string }>`
	position: absolute;
	border-radius: 4px;
	background-color: ${({ theme, $color }) => `${$color}${theme.is_oled ? '90' : 20}`};
`;
