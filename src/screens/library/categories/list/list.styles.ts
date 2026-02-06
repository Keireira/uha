import styled from 'styled-components/native';
import { Text } from '@ui';

export const HeaderTitle = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const Header = styled.Pressable`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 6px;
	padding-bottom: 8px;
`;

export const Title = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-weight: 600;
	font-size: 15px;
	text-align: left;
	color: ${({ theme }) => theme.text.primary};
`;

export const Emoji = styled(Text)<{ $color: string }>`
	font-size: 24px;
	line-height: 48px;
	width: 48px;
	height: 48px;
	text-align: center;
	border-radius: 14px;
	background-color: ${({ $color }) => `${$color}10`};
`;

export const CategoryRoot = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 14px;
	justify-content: flex-start;
	padding-vertical: 8px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => `${theme.border.default}15`};
`;

export default styled.View`
	flex: 1;
	gap: 0;
`;
