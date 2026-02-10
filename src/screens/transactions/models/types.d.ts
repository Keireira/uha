// LENSES | Start
export type TimeModesT = 'all' | 'future';
export type FilterTypeT = 'category' | 'service' | 'tender' | 'currency';

export type AppliedFilterT = {
	type: FilterTypeT;
	value: string;
};

export type LensesModel = {
	time_mode: TimeModesT;
	applied_filters: AppliedFilterT[];
};
// LENSES | End
