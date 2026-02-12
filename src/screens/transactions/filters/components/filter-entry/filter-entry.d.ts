import type { FilterTabT } from '../../filters.d';

export type Props = {
	id: string;
	activeTab: FilterTabT;
	title: string;
	subtitle?: string;
	isImplied: boolean;
	isEligible: boolean;
	isSelected: boolean;
	showDivider: boolean;
	withSeparator: boolean;
};
