import { useShallow } from 'zustand/react/shallow';
import { useLocalSearchParams } from 'expo-router';

import { useEditServiceStore } from '@screens/library/services/hooks';
import { useEditCategoryStore } from '@screens/library/categories/hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SFSymbol } from 'expo-symbols';
import type { SearchParamsT, LogoSnapshotT } from '../select-symbol-logo.d';

export type ParamsBinding = LogoSnapshotT & {
	setImageUri: (uri?: string) => void;
	setSymbol: (symbol?: SFSymbol) => void;
};

const useParams = (): ParamsBinding => {
	const { target } = useLocalSearchParams<SearchParamsT>();

	/* For add_subscription_logo */
	const subscriptionDraft = useDraftStore(
		useShallow((state) => ({
			color: state.logo.color,
			image_uri: state.logo.image_uri,
			symbol: state.logo.symbol,
			setLogoImage: state.actions.setLogoImage,
			setLogoSymbol: state.actions.setLogoSymbol
		}))
	);

	/* For library_category_logo */
	const categoryDraft = useEditCategoryStore(
		useShallow((state) => ({
			color: state.color,
			symbol: state.symbol as SFSymbol,
			logo_url: state.logo_url,
			patch: state.actions.patch
		}))
	);

	/* For library_service_logo */
	const serviceDraft = useEditServiceStore(
		useShallow((state) => ({
			color: state.color,
			image_uri: state.logo_url,
			symbol: state.symbol,
			patch: state.patch
		}))
	);

	switch (target) {
		case 'library_service_logo':
			return {
				color: serviceDraft.color,
				image_uri: serviceDraft.image_uri,
				symbol: serviceDraft.symbol as SFSymbol,
				setImageUri: (logo_uri) => {
					serviceDraft.patch({ logo_url: logo_uri });
				},
				setSymbol: (symbol) => {
					serviceDraft.patch({ symbol });
				}
			};

		case 'library_category_logo': {
			return {
				color: categoryDraft.color,
				image_uri: categoryDraft.logo_url,
				symbol: categoryDraft.symbol as SFSymbol,
				setImageUri: (image_uri) => {
					categoryDraft.patch({ logo_url: image_uri });
				},
				setSymbol: (symbol) => {
					categoryDraft.patch({ symbol });
				}
			};
		}

		case 'add_subscription_logo':
			return {
				color: subscriptionDraft.color,
				symbol: subscriptionDraft.symbol,
				image_uri: subscriptionDraft.image_uri,
				setSymbol: subscriptionDraft.setLogoSymbol,
				setImageUri: subscriptionDraft.setLogoImage
			};

		default:
			throw new Error(`Unknown category target: ${target}`);
	}
};

export default useParams;
