import type { ThemeConfigT } from '@themes';

export type ModeT = {
	mode: ThemeConfigT['tint'] | 'oled';
	icon: string;
	labelKey: string;
	bg: string;
	text: string;
	colorScheme: ThemeConfigT['tint'];
};

export type TilePropsT = {
	$bg: ModeT['bg'];
	$isActive: boolean;
	$accent: string;
};
