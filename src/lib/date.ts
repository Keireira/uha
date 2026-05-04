import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	subDays,
	subMonths,
	subWeeks,
	subYears,
	isAfter,
	endOfToday
} from 'date-fns';

import type { BillingCycleT } from '@screens/crossroad/add-subscription/events';

export const isAfterToday = (date: Date | string) => isAfter(date, endOfToday());

export const addByCycle = (base: Date, type: BillingCycleT, value: number): Date => {
	switch (type) {
		case 'days':
			return addDays(base, value);
		case 'weeks':
			return addWeeks(base, value);
		case 'months':
			return addMonths(base, value);
		case 'years':
			return addYears(base, value);
	}

	return base;
};

export const subByCycle = (base: Date, type: BillingCycleT, value: number): Date => {
	switch (type) {
		case 'days':
			return subDays(base, value);
		case 'weeks':
			return subWeeks(base, value);
		case 'months':
			return subMonths(base, value);
		case 'years':
			return subYears(base, value);
	}
};
