import styled from 'styled-components/native';
import { Text } from '@ui';
import { BlurView } from 'expo-blur';

export const HeaderTitle = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-size: 16px;
	font-weight: 700;
	text-transform: uppercase;
`;

export const Header = styled.Pressable`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 2px;
`;

export const Title = styled(Text).attrs({
	numberOfLines: 1
})`
	flex: 1;
	font-weight: 500;
	font-size: 18px;
	line-height: 25px;
	text-align: left;
	padding: 16px 16px 16px 0px;
`;

export const Emoji = styled(Text)<{ $color: string }>`
	font-size: 24px;
	line-height: 72px;
	background-color: ${({ $color }) => `${$color}30`};
	width: 72px;
	height: 72px;
	text-align: center;
	font-size: 32px;
`;

export const CategoryRoot = styled(BlurView).attrs({
	intensity: 25,
	tint: 'prominent'
})`
	flex-direction: row;
	align-items: center;
	gap: 16px;
	justify-content: flex-start;
	border: 1px solid #33333303;
	background-color: #33333309;
	border-radius: 8px;
	overflow: hidden;
`;

export default styled.View`
	flex: 1;
	gap: 16px;
`;
