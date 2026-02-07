import styled from 'styled-components/native';

export const SwatchesList = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
`;

export const Swatch = styled.Pressable<{ $color: string; $selected: boolean }>`
	height: 36px;
	width: 72px;
	background-color: ${({ $color }) => $color};
	border-radius: 50px;
	border-width: ${({ $selected }) => ($selected ? '2.5px' : '0px')};
	border-color: rgba(255, 255, 255, 0.9);
`;

export const CustomSwatch = styled.Pressable`
	height: 36px;
	width: 72px;
	background-color: rgba(255, 255, 255, 0.15);
	border-radius: 50px;
	align-items: center;
	justify-content: center;
`;

export const PickerWrap = styled.View`
	margin-top: 12px;
`;
