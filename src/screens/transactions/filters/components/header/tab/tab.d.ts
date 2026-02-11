import type { FilterTabT } from '../header.d';

export type Props = {
	label: string;
	isActive: boolean;
	counter: number;
	tab: FilterTabT;
	setActiveTab: (tab: FilterTabT) => void;
};
