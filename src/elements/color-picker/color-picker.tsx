import React, { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import ColorPicker, { HueSlider, Panel1 } from 'reanimated-color-picker';

import { SwatchesList, Swatch, CustomSwatch, PickerWrap } from './color-picker.styles';

const SWATCHES = [
	'#f3a683',
	'#f19066',
	'#f7d794',
	'#f5cd79',
	'#778beb',
	'#546de5',
	'#e77f67',
	'#e15f41',
	'#cf6a87',
	'#c44569',
	'#786fa6',
	'#574b90',
	'#f8a5c2',
	'#f78fb3',
	'#63cdda',
	'#3dc1d3',
	'#ea8685',
	'#e66767'
];

type Props = {
	value: string;
	onSelect: (hex: string) => void;
};

const AppColorPicker = ({ value, onSelect }: Props) => {
	const [showCustom, setShowCustom] = useState(false);

	return (
		<>
			<SwatchesList>
				{SWATCHES.map((color) => (
					<Swatch key={color} $color={color} $selected={value === color} onPress={() => onSelect(color)} />
				))}
				<CustomSwatch onPress={() => setShowCustom(!showCustom)}>
					<SymbolView name="plus" size={16} tintColor="rgba(255,255,255,0.7)" />
				</CustomSwatch>
			</SwatchesList>

			{showCustom && (
				<PickerWrap>
					<ColorPicker
						value={value}
						onCompleteJS={({ hex }: { hex: string }) => onSelect(hex)}
						style={{ width: '100%', gap: 12 }}
					>
						<Panel1 style={{ height: 140, borderRadius: 14 }} />
						<HueSlider style={{ height: 28, borderRadius: 14 }} />
					</ColorPicker>
				</PickerWrap>
			)}
		</>
	);
};

export default AppColorPicker;
