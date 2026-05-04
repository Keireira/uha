import { create } from 'zustand';

import type { SFSymbol } from 'expo-symbols';

type ServiceEditState = {
	id: string;
	slug: string;
	title: string;
	color: string;
	logo_url: string;
	symbol: SFSymbol | '';
	bundle_id: string;
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
