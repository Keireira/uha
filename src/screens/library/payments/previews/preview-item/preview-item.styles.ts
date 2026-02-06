import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
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

export const IconWrapper = styled(GlassView)`
	width: 36px;
	height: 36px;
	border-radius: 12px;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`;

export const IconText = styled(Text)`
	font-size: 20px;
	line-height: 36px;
	text-align: center;
`;

export const Title = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.1px;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled(GlassView)`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: flex-start;
	justify-content: flex-start;
	padding: 14px;
	border-radius: 16px;
	overflow: hidden;
`;
