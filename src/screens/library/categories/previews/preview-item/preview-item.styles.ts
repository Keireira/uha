import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { Text } from '@ui';

export const Title = styled(Text).attrs({
	numberOfLines: 2
})`
	font-size: 12px;
	font-weight: 600;
	text-align: center;
	letter-spacing: 0.3px;
	color: ${({ theme }) => theme.text.primary};
`;

export const IconText = styled(Text)`
	font-size: 28px;
	line-height: 52px;
	text-align: center;
`;

export const IconWrapper = styled(GlassView)`
	width: 52px;
	height: 52px;
	border-radius: 14px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export default styled.Pressable`
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
	justify-content: center;
	padding: 12px 8px;
`;
