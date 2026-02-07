import React from 'react';
import ColorPicker, { HueSlider, Panel1 } from 'reanimated-color-picker';

import { Container, PreviewRow, Swatch, HexLabel } from './color-picker.styles';

type Props = {
	value: string;
	onSelect: (hex: string) => void;
};

const AppColorPicker = ({ value, onSelect }: Props) => {
	const handleComplete = ({ hex }: { hex: string }) => {
		onSelect(hex);
	};

	return (
		<Container>
			<ColorPicker value={value} onCompleteJS={handleComplete} style={{ width: '100%', gap: 16 }}>
				<Panel1 style={{ height: 160, borderRadius: 12 }} />
				<HueSlider style={{ height: 32, borderRadius: 12 }} />
			</ColorPicker>

			<PreviewRow>
				<Swatch $color={value} />
				<HexLabel>{value}</HexLabel>
			</PreviewRow>
		</Container>
	);
};

export default AppColorPicker;
