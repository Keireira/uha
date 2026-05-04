import { create } from 'zustand';

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

const INITIAL_PARAMS: CategoryEditParams = {
	slug: '',
	title: '',
	color: '',
	emoji: undefined,
	symbol: undefined,
	logo_url: undefined
};

const useEditCategoryStore = create<CategoryEditState>((set) => ({
	...INITIAL_PARAMS,

	actions: {
		init: (data) => set({ ...INITIAL_PARAMS, ...data }),
		patch: (patch) => set(patch),
		reset: () => set(INITIAL_PARAMS)
	}
}));

export default useEditCategoryStore;
