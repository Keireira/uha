export type FilterTabT = 'category' | 'service' | 'tender' | 'currency';

export type FilterEntryT = {
	id: string;
	title: string;
	subtitle?: string;
	isSelected: boolean;
	isEligible: boolean;
	isImplied: boolean;
};

export type ActiveEntryT = {
	id: string;
	title: string;
	subtitle?: string;
};

export type SearchSectionT = {
	tab: FilterTabT;
	label: string;
	entries: FilterEntryT[];
};
