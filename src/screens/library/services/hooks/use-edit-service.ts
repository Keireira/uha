import { create } from 'zustand';

import type { SFSymbol } from 'expo-symbols';

/**
 * Edit-state store for `src/screens/library/services/details`.
 *
 * Mirrors `useDraftStore` for the add-subscription flow but only holds the
 * fields a Service row owns. Used as the bridge between the service detail
 * screen and the modal pickers (`select-category`, `select-symbol-logo`) so that
 * sheets can read/commit values without going through expo-router params.
 */

type ServiceEditState = {
	id: string;
	slug: string;
	title: string;
	color: string;
	logo_url: string;
	symbol: SFSymbol | '';
	bundle_id: string;
	ref_link: string;
	category_slug: string;
	aliases: string[];

	init: (data: Partial<Omit<ServiceEditState, 'init' | 'patch' | 'reset'>>) => void;
	patch: (patch: Partial<Omit<ServiceEditState, 'init' | 'patch' | 'reset'>>) => void;
	reset: () => void;
};

const INITIAL: Omit<ServiceEditState, 'init' | 'patch' | 'reset'> = {
	id: '',
	slug: '',
	title: '',
	color: '',
	logo_url: '',
	symbol: '',
	bundle_id: '',
	ref_link: '',
	category_slug: '',
	aliases: []
};

const useEditServiceStore = create<ServiceEditState>((set) => ({
	...INITIAL,

	init: (data) => set({ ...INITIAL, ...data }),
	patch: (patch) => set(patch),
	reset: () => set(INITIAL)
}));

export default useEditServiceStore;
