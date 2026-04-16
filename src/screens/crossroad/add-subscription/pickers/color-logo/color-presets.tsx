import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from 'styled-components/native';
import styled from 'styled-components/native';
import ColorPicker, { HueSlider, SaturationSlider } from 'reanimated-color-picker';

import { Text } from '@ui';

type Props = {
	color: string;
	presets: string[];
	onSelectColor: (hex: string) => void;
	onPresetsChange: (presets: string[]) => void;
};

// const handlePresetsChange = async (next: string[]) => {
// 	setPresets(next);

// 	await db.update(userTable).set({ color_presets: next }).where(eq(userTable.id, USER_ID));
// };
//
const ColorPresets = ({ color, presets, onSelectColor, onPresetsChange }: Props) => {
	const theme = useTheme();
	const [showPicker, setShowPicker] = useState(false);
	const [editing, setEditing] = useState(false);
	const [pickerHex, setPickerHex] = useState(color || '#778beb');

	const handleAddColor = useCallback(() => {
		if (presets.includes(pickerHex)) return;
		onPresetsChange([...presets, pickerHex]);
	}, [pickerHex, presets, onPresetsChange]);

	const handleDeleteColor = useCallback(
		(hex: string) => {
			onPresetsChange(presets.filter((c) => c !== hex));
		},
		[presets, onPresetsChange]
	);

	return (
		<View style={{ gap: 16 }}>
			{/* Horizontal color row */}
			<ColorRow horizontal showsHorizontalScrollIndicator={false}>
				{presets.map((hex) => (
					<ColorCircle
						key={hex}
						$color={hex}
						$selected={color === hex}
						onPress={() => (editing ? handleDeleteColor(hex) : onSelectColor(hex))}
					>
						{editing && (
							<DeleteBadge>
								<SymbolView name="minus.circle.fill" size={18} tintColor={theme.accents.red} />
							</DeleteBadge>
						)}
					</ColorCircle>
				))}
				<AddCircle onPress={() => setShowPicker(!showPicker)}>
					<SymbolView name="plus" size={18} tintColor={theme.text.secondary} />
				</AddCircle>
			</ColorRow>

			{/* Custom color picker card */}
			{showPicker && (
				<PickerCard>
					<PickerHeader>
						<PickerTitle>Choose a color</PickerTitle>
						<HexDisplay>
							<HexHash>#</HexHash>
							<HexValue>{pickerHex.replace('#', '').toUpperCase()}</HexValue>
						</HexDisplay>
						<CloseBtn onPress={() => setShowPicker(false)}>
							<SymbolView name="xmark" size={14} tintColor={theme.text.secondary} />
						</CloseBtn>
					</PickerHeader>

					<ColorPicker
						value={pickerHex}
						onCompleteJS={({ hex }: { hex: string }) => {
							setPickerHex(hex);
							onSelectColor(hex);
						}}
						style={{ width: '100%', gap: 14 }}
					>
						<HueSlider style={{ height: 32, borderRadius: 16 }} />
						<SaturationSlider style={{ height: 32, borderRadius: 16 }} />
					</ColorPicker>

					<PresetsSection>
						<PresetsHeader>
							<PresetsLabel>Presets</PresetsLabel>
							<EditBtn onPress={() => setEditing(!editing)}>
								<EditText $accent={theme.accents.blue}>{editing ? 'Done' : 'Edit'}</EditText>
							</EditBtn>
						</PresetsHeader>

						<PresetsGrid>
							{presets.map((hex) => (
								<SmallCircle
									key={hex}
									$color={hex}
									$selected={color === hex}
									onPress={() => (editing ? handleDeleteColor(hex) : onSelectColor(hex))}
								>
									{editing && (
										<SmallDeleteBadge>
											<SymbolView name="minus.circle.fill" size={16} tintColor={theme.accents.red} />
										</SmallDeleteBadge>
									)}
								</SmallCircle>
							))}
							<SmallAddCircle onPress={handleAddColor}>
								<SymbolView name="plus" size={14} tintColor={pickerHex} />
							</SmallAddCircle>
						</PresetsGrid>

						{editing && <HintText>Tap and hold to reorder</HintText>}
					</PresetsSection>
				</PickerCard>
			)}
		</View>
	);
};

const ColorRow = styled.ScrollView`
	flex-direction: row;
`;

const ColorCircle = styled.Pressable<{ $color: string; $selected: boolean }>`
	width: 44px;
	height: 44px;
	border-radius: 22px;
	background-color: ${({ $color }) => $color};
	margin-right: 10px;
	border-width: ${({ $selected }) => ($selected ? '3px' : '0px')};
	border-color: rgba(255, 255, 255, 0.6);
`;

const DeleteBadge = styled.View`
	position: absolute;
	top: -4px;
	right: -4px;
`;

const AddCircle = styled.Pressable`
	width: 44px;
	height: 44px;
	border-radius: 22px;
	background-color: ${({ theme }) => theme.surface.secondary};
	align-items: center;
	justify-content: center;
`;

const PickerCard = styled.View`
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 20px;
	padding: 20px;
	gap: 16px;
`;

const PickerHeader = styled.View`
	flex-direction: row;
	align-items: center;
`;

const PickerTitle = styled(Text)`
	font-size: 20px;
	font-weight: 700;
	flex: 1;
`;

const HexDisplay = styled.View`
	flex-direction: row;
	align-items: baseline;
	margin-right: 16px;
`;

const HexHash = styled(Text)`
	font-size: 14px;
	color: ${({ theme }) => theme.text.tertiary};
`;

const HexValue = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
`;

const CloseBtn = styled.Pressable`
	padding: 4px;
`;

const PresetsSection = styled.View`
	gap: 12px;
`;

const PresetsHeader = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const PresetsLabel = styled(Text)`
	font-size: 16px;
	font-weight: 700;
`;

const EditBtn = styled.Pressable``;

const EditText = styled(Text)<{ $accent: string }>`
	font-size: 16px;
	font-weight: 600;
	color: ${({ $accent }) => $accent};
`;

const PresetsGrid = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 12px;
`;

const SmallCircle = styled.Pressable<{ $color: string; $selected: boolean }>`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: ${({ $color }) => $color};
	border-width: ${({ $selected }) => ($selected ? '2.5px' : '0px')};
	border-color: rgba(255, 255, 255, 0.6);
`;

const SmallDeleteBadge = styled.View`
	position: absolute;
	top: -3px;
	right: -3px;
`;

const SmallAddCircle = styled.Pressable`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: ${({ theme }) => theme.surface.secondary};
	align-items: center;
	justify-content: center;
`;

const HintText = styled(Text)`
	font-size: 13px;
	color: ${({ theme }) => theme.text.tertiary};
	text-align: center;
`;

export default ColorPresets;
