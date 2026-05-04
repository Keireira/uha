import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from '../symbols-grid.constants';

import { frame, clipShape, background, glassEffect } from '@expo/ui/swift-ui/modifiers';

const useModifiers = (sourceColor: string | undefined) => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const { width: screenWidth } = useWindowDimensions();

	const tint = sourceColor ?? settingAccent;
	const cellSize = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS);

	const shared = [
		frame({
			width: cellSize,
			height: cellSize
		}),
		clipShape('circle')
	];

	const selected = [
		glassEffect({
			glass: {
				variant: 'clear',
				interactive: true,
				tint
			},
			shape: 'circle'
		}),
		background(withAlpha(tint, 0.6), { shape: 'circle' })
	];

	const notSelected = [background(theme.surface.secondary, { shape: 'circle' })];

	return {
		shared,
		selected,
		notSelected
	};
};

export default useModifiers;
