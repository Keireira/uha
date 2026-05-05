import { create } from 'zustand';

import type { PaymentEditParams, PaymentEditState } from '@screens/library/payments';

const INITIAL_PARAMS: PaymentEditParams = {
	title: '',
	comment: '',
	is_card: true,

	color: '',
	emoji: null,
	symbol: null,
	logo_url: null
};

const useEditPaymentStore = create<PaymentEditState>((set) => ({
	...INITIAL_PARAMS,

	actions: {
		init: (data) => set({ ...INITIAL_PARAMS, ...data }),
		patch: (patch) => set(patch),
		reset: () => set(INITIAL_PARAMS)
	}
}));

export default useEditPaymentStore;
