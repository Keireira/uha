import { useNewSubStore } from '../../../../hooks';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';

import { withAlpha } from '@lib/colors';
import { COLUMNS, GRID_GAP, HORIZONTAL_PADDING } from '../symbols-grid.d';
import { frame, clipShape, background, glassEffect } from '@expo/ui/swift-ui/modifiers';

const useModifiers = () => {
	const theme = useTheme();
	const serviceColor = useNewSubStore((state) => state.color);

	const { width: screenWidth } = useWindowDimensions();
	const cellSize = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS);

	return {
		shared: [
			frame({
				width: cellSize,
				height: cellSize
			}),
			clipShape('circle')
		],
		selected: [
			glassEffect({
				glass: {
					variant: 'clear',
					interactive: true,
					tint: serviceColor
				},
				shape: 'circle'
			}),
			background(withAlpha(serviceColor, 0.6), {
				shape: 'circle'
			})
		],
		notSelected: [
			background(theme.surface.secondary, {
				shape: 'circle'
			})
		]
	};
};

export default useModifiers;
