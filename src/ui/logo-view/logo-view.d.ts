import React from 'react';

import type { SFSymbol } from 'expo-symbols';

export type Props = React.PropsWithChildren<{
	name?: string;
	slug?: string | null;
	assetId?: number;
	url?: string | null;
	emoji?: string | null;
	symbolName?: SFSymbol | null;
	color?: string | null;
	size: number;
}>;

export type FallbackProps = {
	emoji: Props['emoji'];
	symbolName: Props['symbolName'];
	initials: string;
	size: number;
	color: Props['color'];
};
