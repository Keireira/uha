import { useTheme } from 'styled-components/native';

import { AUTO_MODE } from '../data';
import { setSettingsValue, useAccent } from '@hooks';

import {
	frame,
	shapes,
	padding,
	disabled,
	background,
	glassEffect,
	onTapGesture,
	contentShape
} from '@expo/ui/swift-ui/modifiers';

import type { ModeT } from '../theme-picker.d';

const useGetModifiers = () => {
	const theme = useTheme();
	const settingAccent = useAccent();

	const selectTheme = (mode: ModeT) => {
		setSettingsValue('oled_mode', mode.mode === 'oled');
		setSettingsValue('theme', mode.mode === 'oled' ? 'dark' : mode.mode);
	};

	const getModeModifiers = (mode: ModeT, isActive: boolean) => [
		frame({
			minHeight: mode === AUTO_MODE ? 56 : 102,
			maxWidth: Number.POSITIVE_INFINITY,
			alignment: 'center'
		}),
		contentShape(shapes.roundedRectangle({ cornerRadius: 16 })),
		background(mode.bg || theme.background.default, shapes.roundedRectangle({ cornerRadius: 13.5 })),
		glassEffect({
			glass: {
				variant: 'regular',
				interactive: true
			},
			shape: 'roundedRectangle',
			cornerRadius: 13.5
		}),
		disabled(isActive),
		padding({ all: 2.5 }),
		background(isActive ? settingAccent : 'transparent', shapes.roundedRectangle({ cornerRadius: 16 })),
		onTapGesture(() => selectTheme(mode))
	];

	return getModeModifiers;
};

export default useGetModifiers;
