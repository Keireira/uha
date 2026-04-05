import React from 'react';

export type Props = React.PropsWithChildren<{
	name: string;
	slug?: string | null;
	assetId?: number;
	url?: string | null;
	emoji?: string | null;
	color?: string | null;
	size: number;
}>;

export type FallbackProps = {
	emoji: Props['emoji'];
	initials: string;
	size: number;
	color: Props['color'];
};
