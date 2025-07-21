import styled from 'styled-components/native';

import { Text } from '@ui';
import { BlurView } from 'expo-blur';

export const Title = styled(Text)`
	font-size: 18px;
	text-shadow: 0 0 4px white;
`;

export const IconWrapper = styled(BlurView).attrs({
	intensity: 25,
	tint: 'prominent'
})`
	width: 48px;
	height: 48px;
	border-radius: 8px;
	overflow: hidden;
	background-color: #ffffff20;
`;

export const IconText = styled(Text)`
	font-size: 28px;
	line-height: 48px;
	text-align: center;
`;

export default styled.Pressable<{ $color: string }>`
	display: flex;
	flex-direction: row;
	gap: 18px;
	align-items: center;
	padding: 18px 36px 18px 18px;
	background-color: ${({ $color }) => `${$color}50`};
	border-radius: 12px;
`;
