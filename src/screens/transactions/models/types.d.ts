// LENSES | Start
export type TimeModesT = 'all' | 'future';
export type FilterTypeT = 'category' | 'service' | 'tender' | 'currency' | 'list';

export type AppliedFilterT = {
	type: FilterTypeT;
	value: string;
};

export type LensesModel = {
	time_mode: TimeModesT;
	applied_filters: AppliedFilterT[];
};
// LENSES | End

// VIEW MODE | Start
export type ViewModeT = 'list' | 'calendar' | 'subscriptions';

export type ViewModeModel = {
	view_mode: ViewModeT;
};
// VIEW MODE | End
