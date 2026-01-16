import { useMemo } from 'react';
import { useAppModel } from '@models';
import * as Crypto from 'expo-crypto';
import { useUnit } from 'effector-react';
import { startOfToday, startOfTomorrow, startOfMonth, isBefore, differenceInSeconds } from 'date-fns';

import useMaxTxDate from './use-max-tx-date';
import { advanceDate, debugLogging } from './utils';
import { useSubscriptionsQuery } from './db-queries';

import type { PreparedDbTxT, PreparedSubscriptionT } from './types.d';

const WITH_LOGS = false;

// @TODO: Implement support of price history,and use data from it, not from `current_price`
const buildPhantomTransaction = (subscription: PreparedSubscriptionT, nextPaymentDate: Date): PreparedDbTxT => {
	const data = {
		id: Crypto.randomUUID(),
		price: subscription.current_price,
		date: nextPaymentDate.toISOString(),
		currency: subscription.currency,
		denominator: subscription.denominator,
		slug: subscription.slug,
		title: subscription.title,
		customName: subscription.custom_name,
		emoji: subscription.emoji,
		color: subscription.color,

		/* category-related fields */
		category_id: subscription.category_id,
		category_title: subscription.category_title,
		category_color: subscription.category_color
	};

	return data;
};

const createFutureTxs = (subscriptions: PreparedSubscriptionT[], maxPaymentDate: Date) => {
	const tomorrow = startOfTomorrow();
	const futureTxs: PreparedDbTxT[] = [];

	for (const subscription of subscriptions) {
		const cancellationDate = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		if (cancellationDate && isBefore(cancellationDate, tomorrow)) {
			continue;
		}

		const latestPaymentDate = subscription.latest_transaction_date
			? new Date(subscription.latest_transaction_date)
			: new Date(subscription.first_payment_date);
		let nextDate = advanceDate(latestPaymentDate, subscription.billing_cycle_type, subscription.billing_cycle_value);

		while (isBefore(nextDate, maxPaymentDate)) {
			futureTxs.push(buildPhantomTransaction(subscription, nextDate));
			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
		}
	}

	return futureTxs;
};

const useCreatePhantomTxs = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const preparedSubscriptions = useSubscriptionsQuery();
	const maxDate = useMaxTxDate(preparedSubscriptions);

	if (__DEV__ && WITH_LOGS) {
		debugLogging(maxDate, preparedSubscriptions);
	}

	const futureTxs = useMemo(() => {
		if (!preparedSubscriptions.length) return [];

		let txs = createFutureTxs(preparedSubscriptions, maxDate);

		if (lensesStore.time_mode === 'future') {
			const now = new Date().toISOString();
			txs = txs.filter((tx) => tx.date >= now);
		}

		return txs;
	}, [preparedSubscriptions, maxDate, lensesStore.time_mode]);

	return {
		phantomTxs: futureTxs.sort((a, b) => differenceInSeconds(a.date, b.date)),
		minPhantomTxsDate: startOfMonth(startOfToday()),
		maxDate
	};
};

export default useCreatePhantomTxs;
