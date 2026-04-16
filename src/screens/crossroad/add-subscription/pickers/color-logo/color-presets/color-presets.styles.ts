import styled from 'styled-components/native';
import { Text } from '@ui';

export const ColorRow = styled.ScrollView`
	flex-direction: row;
`;

export const ColorCircle = styled.Pressable<{ $color: string; $selected: boolean }>`
	width: 44px;
	height: 44px;
	border-radius: 22px;
	background-color: ${({ $color }) => $color};
	margin-right: 10px;
	border-width: ${({ $selected }) => ($selected ? '3px' : '0px')};
	border-color: rgba(255, 255, 255, 0.6);
`;

export const DeleteBadge = styled.View`
	position: absolute;
	top: -4px;
	right: -4px;
`;

export const AddCircle = styled.Pressable`
	width: 44px;
	height: 44px;
	border-radius: 22px;
	background-color: ${({ theme }) => theme.surface.secondary};
	align-items: center;
	justify-content: center;
`;

export const PickerCard = styled.View`
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 20px;
	padding: 20px;
	gap: 16px;
`;

export const PickerHeader = styled.View`
	flex-direction: row;
	align-items: center;
`;

export const PickerTitle = styled(Text)`
	font-size: 20px;
	font-weight: 700;
	flex: 1;
`;

export const HexDisplay = styled.View`
	flex-direction: row;
	align-items: baseline;
	margin-right: 16px;
`;

export const HexHash = styled(Text)`
	font-size: 14px;
	color: ${({ theme }) => theme.text.tertiary};
`;

export const HexValue = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
`;

export const CloseBtn = styled.Pressable`
	padding: 4px;
`;

export const PresetsSection = styled.View`
	gap: 12px;
`;

export const PresetsHeader = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const PresetsLabel = styled(Text)`
	font-size: 16px;
	font-weight: 700;
`;

export const EditBtn = styled.Pressable``;

export const EditText = styled(Text)<{ $accent: string }>`
	font-size: 16px;
	font-weight: 600;
	color: ${({ $accent }) => $accent};
`;

export const PresetsGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 12px;
`;

export const SmallCircle = styled.Pressable<{ $color: string; $selected: boolean }>`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: ${({ $color }) => $color};
	border-width: ${({ $selected }) => ($selected ? '2.5px' : '0px')};
	border-color: rgba(255, 255, 255, 0.6);
`;

export const SmallDeleteBadge = styled.View`
	position: absolute;
	top: -3px;
	right: -3px;
`;

export const SmallAddCircle = styled.Pressable`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: ${({ theme }) => theme.surface.secondary};
	align-items: center;
	justify-content: center;
`;

export const HintText = styled(Text)`
	font-size: 13px;
	color: ${({ theme }) => theme.text.tertiary};
	text-align: center;
`;
