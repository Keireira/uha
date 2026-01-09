import { useMemo } from 'react';
import { max as maxR } from 'ramda';
import {
	isAfter,
	isBefore,
	startOfToday,
	startOfTomorrow,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	endOfMonth
} from 'date-fns';

import type { PreparedSubscriptionT } from './types.d';

export const advanceDate = (
	date: Date,
	type: PreparedSubscriptionT['billing_cycle_type'],
	value: PreparedSubscriptionT['billing_cycle_value']
) => {
	switch (type) {
		case 'days':
			return addDays(date, value);
		case 'weeks':
			return addWeeks(date, value);
		case 'months':
			return addMonths(date, value);
		case 'years':
			return addYears(date, value);
		default:
			return date;
	}
};

/*
 * min horizon is 1 year,
 * max horizon is the end of a month of the most distant (latest) subscription
 */
const findMaxPaymentDate = (subscriptions: PreparedSubscriptionT[]) => {
	const today = startOfToday();
	const tomorrow = startOfTomorrow();

	let maxHorizon = today;
	const minHorizon = addYears(today, 1);

	for (const {
		cancellation_date,
		latest_transaction_date,
		first_payment_date,
		billing_cycle_type,
		billing_cycle_value
	} of subscriptions) {
		const cancellationDate = cancellation_date ? new Date(cancellation_date) : null;

		/* Skip fully cancelled subscriptions */
		if (cancellationDate && isBefore(cancellationDate, tomorrow)) {
			continue;
		}

		const nearestPaymentDate = latest_transaction_date
			? new Date(latest_transaction_date)
			: new Date(first_payment_date);
		let nextDate = advanceDate(nearestPaymentDate, billing_cycle_type, billing_cycle_value);

		if (isAfter(nextDate, maxHorizon)) {
			maxHorizon = nextDate;
		}
	}

	return maxR(endOfMonth(minHorizon), endOfMonth(maxHorizon)) satisfies Date;
};

const useMaxDate = (subscriptions: PreparedSubscriptionT[]) => {
	const maxDate = useMemo(() => findMaxPaymentDate(subscriptions), [subscriptions]);

	return maxDate;
};

export default useMaxDate;
