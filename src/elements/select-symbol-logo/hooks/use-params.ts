import { useShallow } from 'zustand/react/shallow';
import { useLocalSearchParams } from 'expo-router';

import { useEditServiceStore } from '@screens/library/services/hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SFSymbol } from 'sf-symbols-typescript';
import type { SearchParamsT, LogoSnapshotT } from '../select-symbol-logo.d';

export type ParamsBinding = LogoSnapshotT & {
	setImageUri: (uri?: string) => void;
	setSymbol: (symbol?: SFSymbol) => void;
};

const useParams = (): ParamsBinding => {
	const { target } = useLocalSearchParams<SearchParamsT>();

	/* For add_subscription_logo */
	const draft = useDraftStore(
		useShallow((state) => ({
			color: state.logo.color,
			image_uri: state.logo.image_uri,
			symbol: state.logo.symbol,
			setLogoImage: state.actions.setLogoImage,
			setLogoSymbol: state.actions.setLogoSymbol
		}))
	);

	/* For library_service_logo */
	const service = useEditServiceStore(
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
				color: service.color,
				image_uri: service.image_uri,
				symbol: service.symbol as SFSymbol,
				setImageUri: (logo_uri) => {
					service.patch({ logo_url: logo_uri });
				},
				setSymbol: (symbol) => {
					service.patch({ symbol });
				}
			};

		case 'add_subscription_logo':
			return {
				color: draft.color,
				symbol: draft.symbol,
				image_uri: draft.image_uri,
				setSymbol: draft.setLogoSymbol,
				setImageUri: draft.setLogoImage
			};

		default:
			throw new Error(`Unknown category target: ${target}`);
	}
};

export default useParams;
