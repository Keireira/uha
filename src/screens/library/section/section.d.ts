import React from 'react';
import type { Href } from 'expo-router';

export type Props = React.PropsWithChildren<{
	title: string;
	to?: Href;
}>;
