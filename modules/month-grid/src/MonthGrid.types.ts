import type { ViewProps } from 'react-native';

export type MonthGridColors = {
	emptyBg: string;
	textPrimary: string;
	textHighlight: string;
	markSelected: string;
	markTx: string;
	headerColor: string;
};

export type MonthGridProps = ViewProps & {
	title: string;
	year: number;
	month: number;
	weekStartsOn: 0 | 1;
	isInRange: boolean;
	daysWithTxs: string[];
	selectedDay: string | null;
	colors: MonthGridColors;
	onPressMonth?: () => void;
};
