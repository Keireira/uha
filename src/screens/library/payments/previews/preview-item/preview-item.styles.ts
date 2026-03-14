import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import { Text } from '@ui';

export const Top = styled.View`
	display: flex;
	flex-direction: row;
	gap: 10px;
	align-items: center;
`;

export const Bottom = styled.View`
	display: flex;
	align-items: flex-start;
	width: 100%;
`;

export const Comment = styled(Text).attrs({
	numberOfLines: 1
})`
	font-size: 11px;
	font-weight: 400;
	letter-spacing: 0.2px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const IconWrapper = styled(BlurView).attrs({ intensity: 20, tint: 'prominent' })`
	width: 40px;
	height: 40px;
	border-radius: 12px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export const IconText = styled(Text)`
	font-size: 22px;
	line-height: 40px;
	text-align: center;
`;

export const Title = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.1px;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled(BlurView).attrs({ intensity: 15, tint: 'prominent' })`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: flex-start;
	justify-content: flex-start;
	padding: 14px;
	border-radius: 18px;
	overflow: hidden;
`;
