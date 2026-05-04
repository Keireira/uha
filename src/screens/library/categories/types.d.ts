import type { SFSymbol } from 'expo-symbols';

export type CategoryEditParams = {
	slug: string;
	title: string;
	color: string;
	emoji?: string;
	symbol?: SFSymbol;
	logo_url?: string;
};

type CategoryEditActions = {
	init: (data: Partial<CategoryEditParams>) => void;
	patch: (patch: Partial<CategoryEditParams>) => void;
	reset: () => void;
};

type CategoryEditState = CategoryEditParams & {
	actions: CategoryEditActions;
};
