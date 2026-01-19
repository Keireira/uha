import { useMemo } from 'react';
import { max as maxR } from 'ramda';
import { advanceDate } from './utils';
import { isAfter, isBefore, startOfToday, startOfTomorrow, addYears, endOfMonth } from 'date-fns';

import type { PreparedSubscriptionT } from './types.d';

/*
 * min horizon is 2 years,
 * max horizon is the end of a month of the most distant (latest) subscription
 */
const findMaxTxDate = (subscriptions: PreparedSubscriptionT[]) => {
	const today = startOfToday();
	const tomorrow = startOfTomorrow();

	let maxHorizon = today;
	const minHorizon = addYears(today, 2);

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

const useMaxTxDate = (subscriptions: PreparedSubscriptionT[], debugLabel?: string) => {
	const maxDate = useMemo(() => findMaxTxDate(subscriptions), [subscriptions]);

	return maxDate;
};

export default useMaxTxDate;
