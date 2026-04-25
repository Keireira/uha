import * as Haptics from 'expo-haptics';
import { useShallow } from 'zustand/react/shallow';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SearchParamsT } from '../select-tender.d';

type ParamsBinding = {
	currentValue: string | null;
	commit: (code: string) => void;
};

const useCategoryBinding = (): ParamsBinding => {
	const router = useRouter();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const { tenderId, setTenderId } = useDraftStore(
		useShallow((state) => ({
			tenderId: state.tender_id,
			setTenderId: state.actions.setTenderId
		}))
	);

	switch (target) {
		case 'add_subscription_tender':
			return {
				currentValue: tenderId,
				commit: (slug: string | null) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					setTenderId(slug);
					router.back();
				}
			};

		default:
			throw new Error(`Unknown tender target: ${target}`);
	}
};

export default useCategoryBinding;
