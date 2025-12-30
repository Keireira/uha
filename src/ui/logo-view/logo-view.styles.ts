import styled from 'styled-components/native';
import { Text } from '../typography';
import { BlurView as ExpoBlurView } from 'expo-blur';

export const Emoji = styled(Text)`
	font-size: 24px;
`;

export const BlurView = styled(ExpoBlurView)`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default styled.View<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ $color }) => `${$color}30`};
`;
