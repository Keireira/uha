import { create } from 'zustand';

import type { ServiceT } from '@models';

type SubscriptionFormParamsT = ServiceT & {
	symbol?: string;
};

export type SubscriptionStoreT = SubscriptionFormParamsT & {
	actions: ActionsT;
};

type ActionsT = {
	init: (data: Partial<ServiceT>) => void;
	setTitle: (title: string) => void;
	setColor: (color: string) => void;
	setLogoUrl: (logo_url: string) => void;
	setSlug: (slug: string) => void;
	setCustomSymbol: (symbol?: string) => void;

	setBatch: (data: Partial<SubscriptionFormParamsT>) => void;
	reset: () => void;
};

const initialData: SubscriptionFormParamsT = {
	title: '',
	color: '',
	logo_url: '',
	slug: '',
	id: '',
	bundle_id: '',
	ref_link: '',
	domains: [],
	social_links: {},
	aliases: [],
	category_slug: '',
	symbol: undefined
};

const useAddSubcriptionStore = create<SubscriptionStoreT>((set) => ({
	...initialData,

	actions: {
		init: (data) => {
			return set({
				...initialData,
				...data
			});
		},

		setBatch: (data) => set({ ...data }),

		// Logo part
		setColor: (color) => set({ color }),
		setLogoUrl: (logo_url) => set({ logo_url }),
		setCustomSymbol: (symbol) => set({ symbol }),

		setTitle: (title) => set({ title }),
		setSlug: (slug) => set({ slug }),

		reset: () => set({ ...initialData })
	}
}));

export default useAddSubcriptionStore;
