import type { SFSymbol } from 'expo-symbols';

export type PaymentEditParams = {
	title: string;
	comment: string;
	is_card: boolean;

	color: string;
	emoji: string | null;
	symbol: SFSymbol | null;
	logo_url: string | null;
};

type PaymentEditActions = {
	init: (data: Partial<PaymentEditParams>) => void;
	patch: (patch: Partial<PaymentEditParams>) => void;
	reset: () => void;
};

type PaymentEditState = PaymentEditParams & {
	actions: PaymentEditActions;
};
