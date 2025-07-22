import styled from 'styled-components/native';
import { Button } from '@expo/ui/swift-ui';
import { Pressable } from 'react-native';
import { Text } from '@ui';

export const Grid = styled.View`
	padding: 18px;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 16px;
`;

export const Icon = styled.View`
	background-color: #dfdfdf;
	padding: 16px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 32px;
`;

export const Entities = styled.View`
	flex-direction: row;
	gap: 16px;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
`;

export const TileButton = styled(Button)<{ $height: number }>`
	flex-grow: 1;
	height: ${({ $height }) => $height}px;
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: #dddddd50;
`;

export const FullButton = styled(Button)`
	width: 100%;
	display: flex;
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: #dddddd50;
`;

export const TilePress = styled(Pressable)`
	height: 100%;
	padding: 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export const TileText = styled(Text).attrs({
	numberOfLines: 1
})`
	font-size: 18px;
	font-weight: bold;
`;
