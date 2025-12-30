import styled from 'styled-components/native';

import { Text } from '@ui';
import { LinearGradient } from 'expo-linear-gradient';

export const Gradient = styled(LinearGradient)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

export const Title = styled(Text)`
	font-size: 16px;
	line-height: 20px;
	text-align: center;
	font-weight: 400;
	text-shadow: 0 0 4px white;
`;

export default styled.Pressable<{ $color: string }>`
	position: relative;
	display: flex;
	width: 120px;
	flex-direction: column;
	gap: 18px;
	align-items: center;
	justify-content: flex-start;
	background-color: #fff;
	padding: 18px;
	border-radius: 12px;
	overflow: hidden;
`;
