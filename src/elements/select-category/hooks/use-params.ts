import * as Haptics from 'expo-haptics';
import { useShallow } from 'zustand/react/shallow';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SearchParamsT } from '../select-category.d';

type ParamsBinding = {
	currentValue: string;
	commit: (code: string) => void;
};

const useCategoryBinding = (): ParamsBinding => {
	const router = useRouter();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const { categorySlug, setCategorySlug } = useDraftStore(
		useShallow((state) => ({
			categorySlug: state.category_slug,
			setCategorySlug: state.actions.setCategorySlug
		}))
	);

	switch (target) {
		case 'add_subscription_category':
			return {
				currentValue: categorySlug,
				commit: (slug) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					setCategorySlug(slug);
					router.back();
				}
			};

		default:
			throw new Error(`Unknown category target: ${target}`);
	}
};

export default useCategoryBinding;
