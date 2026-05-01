import type { ThemeConfigT } from '@themes/themes.d';
import type { SFSymbol } from 'sf-symbols-typescript';

export type ToastKindT = 'success' | 'error' | 'info';

export type ToastMetaT = {
	icon: SFSymbol;
	tint: keyof ThemeConfigT['semantic'];
};
