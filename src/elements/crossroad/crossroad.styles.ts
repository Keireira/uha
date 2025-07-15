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

export const TileButton = styled(Button)<{ $width: number }>`
	aspect-ratio: 4/3;
	width: ${({ $width }) => $width}px;
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: transparent;
`;

export const TilePress = styled(Pressable)`
	height: 100%;
	padding: 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export const TileText = styled(Text)`
	font-size: 22px;
	font-weight: bold;
`;
