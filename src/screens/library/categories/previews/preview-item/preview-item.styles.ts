import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import { Text } from '@ui';

export const Title = styled(Text).attrs({
	numberOfLines: 2
})`
	font-size: 12px;
	font-weight: 600;
	text-align: center;
	letter-spacing: 0.2px;
	line-height: 16px;
	color: ${({ theme }) => theme.text.primary};
`;

export const IconWrapper = styled(BlurView).attrs({ intensity: 40, tint: 'prominent' })`
	width: 60px;
	height: 60px;
	border-radius: 18px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => `${theme.surface.default}40`};
`;

export default styled.Pressable`
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
	justify-content: flex-start;
	padding: 12px 4px;
`;
