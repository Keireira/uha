import { create } from 'zustand';

import type { ServiceT } from '@models';

type ActionsT = {
	init: (data: Partial<ServiceT>) => void;
	setTitle: (title: string) => void;
	setColor: (color: string) => void;
	setLogoUrl: (logo_url: string) => void;
	setSlug: (slug: string) => void;
	reset: () => void;
};

type SubscriptionStoreT = ServiceT & {
	actions: ActionsT;
};

const initialData: ServiceT = {
	title: '',
	color: '',
	logo_url: '',
	slug: ''
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

		setTitle: (title) => set({ title }),
		setColor: (color) => set({ color }),
		setLogoUrl: (logo_url) => set({ logo_url }),
		setSlug: (slug) => set({ slug }),

		reset: () => set(initialData)
	}
}));

export default useAddSubcriptionStore;
