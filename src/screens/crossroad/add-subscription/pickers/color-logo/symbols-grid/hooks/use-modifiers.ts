import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from '../symbols-grid.constants';

import { frame, clipShape, background, glassEffect } from '@expo/ui/swift-ui/modifiers';

const useModifiers = () => {
	const theme = useTheme();
	const settingAccent = useAccent();
	const { width: screenWidth } = useWindowDimensions();
	const draftColor = useDraftStore((state) => state.logo.color ?? settingAccent);

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
				tint: draftColor
			},
			shape: 'circle'
		}),
		background(withAlpha(draftColor, 0.6), { shape: 'circle' })
	];

	const notSelected = [background(theme.surface.secondary, { shape: 'circle' })];

	return {
		shared,
		selected,
		notSelected
	};
};

export default useModifiers;
