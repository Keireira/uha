import styled from 'styled-components/native';
import { Button } from '@expo/ui/swift-ui';

export const Grid = styled.View`
	padding: 24px;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 16px;
`;

export const Square = styled(Button)<{ $width: number }>`
	aspect-ratio: 4/3;
	width: ${({ $width }) => $width}px;
	font-family: 'Nunito';
	border-radius: 16px;
	background-color: transparent;
`;
