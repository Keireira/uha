import { format, parse, addMonths, endOfMonth } from 'date-fns';
import { createEvent, createStore, sample } from 'effector';

import type { LensT, FilterTypeT, AppliedFilterT, LensesModel } from '@models/app-model.d';

const DEFAULT_LENS = 'upcoming';

const TODAY = format(new Date(), 'yyyy-MM-dd');

const FROM_TODAY = {
	start_date: parse(TODAY, 'yyyy-MM-dd', new Date()),
	end_date: null
};

const NO_DATE = {
	start_date: null,
	end_date: null
};

// Move somewhere else? Maybe create different directory like:
// @models/lenses/lenses.ts + @models/lenses/utils.ts + @models/lenses/constants.ts + @models/lenses/types.ts + @models/lenses/index.ts
export const generateLenses = (lens: LensT | Partial<LensesModel>): Omit<LensesModel, 'applied_filters' | 'primary_lens'> => {
	const lensType = typeof lens === 'string' ? lens : lens.primary_lens;

	switch (lensType) {
		case 'infinite': return NO_DATE;

		case 'upcoming': return FROM_TODAY;

		case 'past_and_upcoming': return NO_DATE;

		case 'selected_period': {
			const startDate = typeof lens === 'string' ? undefined : lens.start_date;
			const endDate = typeof lens === 'string' ? undefined : lens.end_date;

			return {
				start_date: startDate || FROM_TODAY.start_date,
				end_date: endDate || endOfMonth(addMonths(new Date(), 1)),
			}
		}

		default: return FROM_TODAY;
	}
};

const createLensesModel = () => {
	const $lenses = createStore<LensesModel>({
		primary_lens: DEFAULT_LENS,
		...generateLenses({ primary_lens: DEFAULT_LENS }),
		applied_filters: []
	});

	// Set lens | Start
	const setPrimaryLens = createEvent<LensT | Omit<LensesModel, 'applied_filters' | 'start_date' | 'end_date'>>();
	sample({
		clock: setPrimaryLens,
		source: $lenses,
		fn: (lenses, nextLens) => {
			const newLens = generateLenses(nextLens);

			return {
				primary_lens: typeof nextLens === 'string' ? nextLens : nextLens.primary_lens,
				applied_filters: lenses.applied_filters,
				...newLens,
			}
		},
		target: $lenses,
	});
	// Set lens | End

	// Set Filters | Start
	const addFilter = createEvent<AppliedFilterT>();
	sample({
		clock: addFilter,
		source: $lenses,
		fn: (lenses, filter) => ({
				...lenses,
				applied_filters: [...lenses.applied_filters, filter],
		}),
		target: $lenses,
	})

	const removeFilter = createEvent<{ type: FilterTypeT; value?: string }>();
	sample({
		clock: removeFilter,
		source: $lenses,
		fn: (lenses, filterToRemove) => ({
			...lenses,
			applied_filters: lenses.applied_filters.filter((filter) => {
				const byType = filter.type !== filterToRemove.type;
				const byValue = filterToRemove.value && filter.value !== filterToRemove.value;

				return byType || byValue;
			}),
		}),
		target: $lenses,
	})
	// Set Filters | End

	return {
		$store: $lenses,
		setPrimaryLens,
		filters: {
			add: addFilter,
			remove: removeFilter,
		}
	}
};

export default createLensesModel;
