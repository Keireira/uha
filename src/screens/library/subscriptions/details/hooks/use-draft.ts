import { useShallow } from 'zustand/react/shallow';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SFSymbol } from 'expo-symbols';

const useDraft = () => {
	const draft = useDraftStore(
		useShallow((state) => ({
			custom_name: state.custom_name,
			category_slug: state.category_slug,
			tender_id: state.tender_id,
			logo: state.logo,
			notes: state.notes,
			notify_enabled: state.notify_enabled,
			notify_days_before: state.notify_days_before,
			notify_trial_end: state.notify_trial_end,
			timeline: state.timeline,
			billing_cycle_type: state.billing_cycle_type,
			billing_cycle_value: state.billing_cycle_value
		}))
	);

	const setTitle = useDraftStore((state) => state.actions.setSubscriptionTitle);
	const setNotes = useDraftStore((state) => state.actions.setNotes);
	const setNotifyEnabled = useDraftStore((state) => state.actions.setNotifyEnabled);
	const setLogoImage = useDraftStore((state) => state.actions.setLogoImage);
	const setLogoSymbol = useDraftStore((state) => state.actions.setLogoSymbol);

	const resetCustomLogo = () => setLogoImage(undefined);
	const resetCustomSymbol = () => setLogoSymbol(undefined as unknown as SFSymbol | undefined);

	return {
		draft,
		actions: {
			setTitle,
			setNotes,
			setNotifyEnabled,
			resetCustomLogo,
			resetCustomSymbol
		}
	};
};

export default useDraft;
