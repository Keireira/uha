import { createEvent, createStore, combine, sample } from 'effector';
import { uniqBy, remove } from 'ramda';

import type { FilterTypeT, AppliedFilterT, LensesModel, TimeModesT } from '@models/app-model.d';

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

	// Twins | Start
	const $wo_twins = createStore<LensesModel['wo_twins']>(true);
	const setWoTwins = createEvent<LensesModel['wo_twins']>();
	sample({
		clock: setWoTwins,
		target: $wo_twins
	});
	// Twins | End

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
		wo_twins: $wo_twins,
		filters: $filters
	});

	return {
		$store: $combinedStore,
		setTimeMode,
		setWoTwins,
		filters: {
			add: addFilter,
			remove: removeFilter,
			clear: clearFilters
		}
	};
};

export default createLensesModel;
