import type { SFSymbol } from 'expo-symbols';

export type SelectLogoTarget = 'add_subscription_logo' | 'library_category_logo' | 'library_service_logo';

export type SearchParamsT = {
	target: SelectLogoTarget;
};

export type LogoSnapshotT = {
	color?: string;
	image_uri?: string;
	symbol?: SFSymbol;
};
