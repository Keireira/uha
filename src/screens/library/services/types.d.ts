import type { SFSymbol } from 'expo-symbols';

export type ServiceEditParams = {
	slug: string;
	title: string;
	bundle_id: string;
	category_slug: string;
	aliases: string[];

	color: string;
	emoji?: string;
	symbol?: SFSymbol;
	logo_url?: string;
};

type ServiceEditActions = {
	init: (data: Partial<ServiceEditParams>) => void;
	patch: (patch: Partial<ServiceEditParams>) => void;
	reset: () => void;
};

type ServiceEditState = ServiceEditParams & {
	actions: ServiceEditActions;
};
