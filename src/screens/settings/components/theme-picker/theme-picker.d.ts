import type { ThemeConfigT } from '@themes';
import type { UserT } from '@models';
import type { SFSymbol } from 'sf-symbols-typescript';

export type ModeT = {
	mode: UserT['theme'] | 'oled';
	icon: SFSymbol;
	labelKey: string;
	bg?: string;
	text?: string;
	colorScheme: ThemeConfigT['tint'];
};
