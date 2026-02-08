export type FilterTabT = 'category' | 'service' | 'tender' | 'currency';

export type FilterEntryT = {
	id: string;
	title: string;
	subtitle?: string;
	isSelected: boolean;
	isEligible: boolean;
	isImplied: boolean;
};
