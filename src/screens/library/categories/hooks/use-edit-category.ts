import { create } from 'zustand';

import type { CategoryEditParams, CategoryEditState } from '@screens/library/categories';

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
