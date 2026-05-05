import { create } from 'zustand';

import type { ServiceEditParams, ServiceEditState } from '@screens/library/services';

const INITIAL_PARAMS: ServiceEditParams = {
	slug: '',
	title: '',
	bundle_id: '',
	category_slug: '',
	aliases: [],

	color: '',
	emoji: null,
	symbol: null,
	logo_url: null
};

const useEditServiceStore = create<ServiceEditState>((set) => ({
	...INITIAL_PARAMS,

	actions: {
		init: (data) => set({ ...INITIAL_PARAMS, ...data }),
		patch: (patch) => set(patch),
		reset: () => set(INITIAL_PARAMS)
	}
}));

export default useEditServiceStore;
