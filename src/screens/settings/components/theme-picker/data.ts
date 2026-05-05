import type { ModeT } from './theme-picker.d';

export const AUTO_MODE: ModeT = {
	mode: 'auto',
	icon: 'circle.lefthalf.filled',
	labelKey: 'settings.appearance.auto',
	colorScheme: 'dark'
};

export const MODES: ModeT[] = [
	{
		mode: 'light',
		icon: 'sun.max.fill',
		labelKey: 'settings.appearance.light',
		bg: '#ffffff',
		text: '#1C1C1E',
		colorScheme: 'light'
	},
	{
		mode: 'dark',
		icon: 'moon.fill',
		labelKey: 'settings.appearance.dark',
		bg: '#1c1c1e',
		text: '#fafafa',
		colorScheme: 'dark'
	},
	{
		mode: 'oled',
		icon: 'moon.stars.fill',
		labelKey: 'settings.appearance.oled',
		bg: '#000000',
		text: '#ffffff',
		colorScheme: 'dark'
	}
];
