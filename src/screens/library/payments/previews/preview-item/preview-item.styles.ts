import styled from 'styled-components/native';

import { Text } from '@ui';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const Top = styled.View`
	display: flex;
	flex-direction: row;
	gap: 18px;
	align-items: center;
	justify-content: flex-start;
`;

export const Bottom = styled.View`
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	width: 100%;
`;

export const Comment = styled(Text)`
	font-size: 14px;
	line-height: 19px;
	font-weight: 400;
	color: #333;
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

export const Gradient = styled(LinearGradient)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

export const Title = styled(Text)`
	font-size: 18px;
	line-height: 20px;
	text-align: center;
	font-weight: 400;
	text-shadow: 0 0 4px white;
`;

export default styled.Pressable<{ $color: string }>`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 18px;
	align-items: flex-start;
	justify-content: flex-start;
	background-color: #fff;
	padding: 18px;
	border-radius: 12px;
	overflow: hidden;
	aspect-ratio: 1.586 / 1;
`;
