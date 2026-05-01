import type { SFSymbol } from 'sf-symbols-typescript';

export type SelectLogoTarget = 'add_subscription_logo' | 'library_service_logo';

export type SearchParamsT = {
	target: SelectLogoTarget;
};

export type LogoSnapshotT = {
	color?: string;
	image_uri?: string;
	symbol?: SFSymbol;
};
