import styled from 'styled-components/native';
import { Host, Button } from '@expo/ui/swift-ui';
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

export const TileButton = styled(Button)`
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: #dddddd50;
`;

export const TileButtonHost = styled(Host)<{ $height: number }>`
	height: ${({ $height }) => $height}px;
	flex-grow: 1;
`;

export const FullButton = styled(Button)`
	display: flex;
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: #dddddd50;
`;

export const FullButtonHost = styled(Host)<{ $height: number }>`
	height: ${({ $height }) => $height}px;
	width: 100%;
`;

export const SheetHost = styled(Host)<{ $height: number }>`
	position: absolute;
	height: ${({ $height }) => $height}px;
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
