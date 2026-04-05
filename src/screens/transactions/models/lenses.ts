import { create } from 'zustand';
import { uniqBy, remove } from 'ramda';

import type { FilterTypeT, AppliedFilterT, LensesModel, TimeModesT } from './types.d';

export const ALL_TIME_MODES: TimeModesT[] = ['all', 'future'];

type LensesState = {
	time_mode: LensesModel['time_mode'];
	filters: LensesModel['applied_filters'];
};

type LensesActions = {
	setTimeMode: (mode: LensesModel['time_mode']) => void;
	addFilter: (filter: AppliedFilterT) => void;
	removeFilter: (filter: { type: FilterTypeT; value?: string }) => void;
	clearFilters: () => void;
};

const useLensesStore = create<LensesState & LensesActions>((set) => ({
	time_mode: 'future',
	filters: [],

	setTimeMode: (mode) => set({ time_mode: mode }),

	addFilter: (newFilter) =>
		set((state) => ({
			filters: uniqBy((filter) => `${filter.type}${filter.value}`, [...state.filters, newFilter])
		})),

	removeFilter: (filterToRemove) =>
		set((state) => {
			const indexToRemove = state.filters.findIndex(
				(filter) => filter.type === filterToRemove.type && filter.value === filterToRemove.value
			);

			if (indexToRemove === -1) return state;

			return { filters: remove(indexToRemove, 1, state.filters) };
		}),

	clearFilters: () => set({ filters: [] })
}));

export default useLensesStore;
