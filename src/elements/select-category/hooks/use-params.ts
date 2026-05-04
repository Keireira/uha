import * as Haptics from 'expo-haptics';
import { useShallow } from 'zustand/react/shallow';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useEditServiceStore } from '@screens/library/services/hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SearchParamsT } from '../select-category.d';

type ParamsBinding = {
	currentValue: string;
	commit: (code: string) => void;
};

const useCategoryBinding = (): ParamsBinding => {
	const router = useRouter();
	const { target } = useLocalSearchParams<SearchParamsT>();

	/* For add_subscription_category */
	const draft = useDraftStore(
		useShallow((state) => ({
			categorySlug: state.category_slug,
			setCategorySlug: state.actions.setCategorySlug
		}))
	);

	/* For library_service_category */
	const service = useEditServiceStore(
		useShallow((state) => ({
			categorySlug: state.category_slug,
			patch: state.patch
		}))
	);

	switch (target) {
		case 'add_subscription_category':
			return {
				currentValue: draft.categorySlug,
				commit: (slug) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					draft.setCategorySlug(slug);
					router.back();
				}
			};

		case 'library_service_category':
			return {
				currentValue: service.categorySlug,
				commit: (slug) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					service.patch({ category_slug: slug });
					router.back();
				}
			};

		default:
			throw new Error(`Unknown category target: ${target}`);
	}
};

export default useCategoryBinding;
