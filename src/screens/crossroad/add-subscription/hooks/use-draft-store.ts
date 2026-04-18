import { create } from 'zustand';

import type { ServiceT } from '@models';

type SubscriptionDraftT = ServiceT & {
	symbol?: string;
};

type LogoSnapshotT = {
	logo_url: string | null;
	symbol?: string;
	color: string;
};

export type SubscriptionStoreT = SubscriptionDraftT & {
	logoSnapshot: LogoSnapshotT;
	actions: ActionsT;
};

type ActionsT = {
	init: (data: Partial<ServiceT>) => void;
	patch: (data: Partial<SubscriptionDraftT>) => void;

	setTitle: (title: string) => void;
	setSlug: (slug: string) => void;
	setColor: (color: string) => void;
	setLogoUrl: (logo_url: string) => void;
	setSymbol: (symbol?: string) => void;

	resetLogo: () => void;
	reset: () => void;
};

const initialDraft: SubscriptionDraftT = {
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

const initialSnapshot: LogoSnapshotT = {
	logo_url: '',
	symbol: undefined,
	color: ''
};

const useDraftStore = create<SubscriptionStoreT>((set) => ({
	...initialDraft,
	logoSnapshot: initialSnapshot,

	actions: {
		init: (data) => {
			const draft = { ...initialDraft, ...data };

			set({
				...draft,
				logoSnapshot: {
					logo_url: draft.logo_url,
					symbol: draft.symbol,
					color: draft.color
				}
			});
		},

		patch: (data) => set({ ...data }),

		setTitle: (title) => set({ title }),
		setSlug: (slug) => set({ slug }),
		setColor: (color) => set({ color }),
		setLogoUrl: (logo_url) => set({ logo_url }),
		setSymbol: (symbol) => set({ symbol }),

		resetLogo: () => {
			set((state) => ({
				logo_url: state.logoSnapshot.logo_url,
				symbol: state.logoSnapshot.symbol,
				color: state.logoSnapshot.color
			}));
		},

		reset: () => {
			set({
				...initialDraft,
				logoSnapshot: initialSnapshot
			});
		}
	}
}));

export default useDraftStore;
