import React from 'react';

export type Props = React.PropsWithChildren<
	| {
			logoId?: number;
			logoUrl?: string;
			name: string;
			emoji?: string;
			size: number;
			color?: string;
	  }
	| {
			size: number;
			emoji: string;

			name?: string;
			color?: string;
			logoId?: number;
			logoUrl?: string;
	  }
>;
