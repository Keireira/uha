import { createEvent, createStore, combine, sample } from 'effector';
import { uniqBy, remove } from 'ramda';

import type { FilterTypeT, AppliedFilterT, LensesModel, TimeModesT } from './types.d';

export const ALL_TIME_MODES: TimeModesT[] = ['all', 'future'];

const createLensesModel = () => {
	// Time Modes | Start
	const $timeMode = createStore<LensesModel['time_mode']>('future');
	const setTimeMode = createEvent<LensesModel['time_mode']>();
	sample({
		clock: setTimeMode,
		target: $timeMode
	});
	// Time Modes | End

	// Filters | Start
	const $filters = createStore<LensesModel['applied_filters']>([]);

	const addFilter = createEvent<AppliedFilterT>();
	sample({
		clock: addFilter,
		source: $filters,
		fn: (filters, newFilter) => uniqBy((filter) => `${filter.type}${filter.value}`, [...filters, newFilter]),
		target: $filters
	});

	const removeFilter = createEvent<{ type: FilterTypeT; value?: string }>();
	sample({
		clock: removeFilter,
		source: $filters,
		fn: (filters, filterToRemove) => {
			const indexToRemove = filters.findIndex((filter) => {
				return filter.type === filterToRemove.type && filter.value === filterToRemove.value;
			});

			if (indexToRemove === -1) {
				return filters;
			}

			return remove(indexToRemove, 1, filters);
		},
		target: $filters
	});

	const clearFilters = createEvent();
	sample({
		clock: clearFilters,
		target: $filters,
		fn: () => []
	});
	// Filters | End

	const $combinedStore = combine({
		time_mode: $timeMode,
		filters: $filters
	});

	return {
		$store: $combinedStore,
		time_mode: {
			set: setTimeMode
		},
		filters: {
			add: addFilter,
			remove: removeFilter,
			clear: clearFilters
		}
	};
};

export default createLensesModel;
