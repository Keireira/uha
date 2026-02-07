import styled from 'styled-components/native';

export const Container = styled.View`
	align-items: center;
	gap: 16px;
`;

export const PreviewRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

export const Swatch = styled.View<{ $color: string }>`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: ${({ $color }) => $color};
`;

export const HexLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
	text-transform: uppercase;
`;
