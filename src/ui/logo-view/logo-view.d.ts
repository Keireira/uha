import React from 'react';

export type Props = React.PropsWithChildren<{
	name: string;
	slug?: string;
	assetId?: number;
	url?: string;
	emoji?: string;
	color?: string;
	size: number;
}>;
