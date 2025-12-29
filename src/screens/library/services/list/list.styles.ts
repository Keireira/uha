import styled from 'styled-components/native';
import { Text } from '@ui';
import { BlurView } from 'expo-blur';

export const Icon = styled.View<{ $color: string }>`
	width: 72px;
	height: 72px;
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: ${({ $color }) => `${$color}30`};
`;

export const HeaderTitle = styled(Text)`
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
})<{ $withComment: boolean }>`
	font-weight: 500;
	font-size: ${({ $withComment }) => ($withComment ? '16px' : '18px')};
	text-align: left;
`;

export const Subtitle = styled(Text).attrs({
	numberOfLines: 1
})`
	font-weight: 400;
	font-size: 12px;
	text-align: left;
	color: #666;
`;

export const Description = styled.View`
	flex: 1;
	gap: 12px;
	padding: 16px 16px 16px 0px;
`;

export const ServiceRoot = styled(BlurView).attrs({
	intensity: 25,
	tint: 'prominent'
})`
	height: 72px;
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
