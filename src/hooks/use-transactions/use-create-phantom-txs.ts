import { useMemo } from 'react';
import { useAppModel } from '@models';
import * as Crypto from 'expo-crypto';
import { useUnit } from 'effector-react';
import { startOfTomorrow, isBefore } from 'date-fns';

import useSubscriptionsQuery from './use-subs-query';
import useMaxDate, { advanceDate } from './use-max-date';

import type { PreparedDbTxT, PreparedSubscriptionT } from './types.d';

const WITH_LOGS = true;

const debugLogging = (maxDate: Date, preparedSubscriptions: PreparedSubscriptionT[]) => {
	console.log('\n\x1b[1m\x1b[35m🔮 Phantom Transactions\x1b[0m');
	console.log('\x1b[90m═══════════════════════════════════════════\x1b[0m');
	console.log(`\x1b[33m📅 Max Date:\x1b[0m ${maxDate}`);
	console.log(`\x1b[33m📦 Total:\x1b[0m   ${preparedSubscriptions.length} subscriptions\n`);

	preparedSubscriptions.forEach((sub, index) => {
		const name = sub.custom_name || sub.title || 'Unnamed';
		const price = `${sub.currency}${(sub.current_price / (sub.denominator ?? 100)).toFixed(2)}`;
		const cycle = `${sub.billing_cycle_value} ${sub.billing_cycle_type}`;

		console.log(`\x1b[36m┌─ ${sub.emoji ?? '📋'} \x1b[1m${name} (${index + 1})\x1b[0m`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mID:\x1b[0m       ${sub.id.slice(0, 8)}…`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mService:\x1b[0m  ${sub.slug ?? '—'}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mCategory:\x1b[0m ${sub.category ?? '—'}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[32mPrice:\x1b[0m    ${price}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mCycle:\x1b[0m    every ${cycle}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mStarted:\x1b[0m  ${sub.first_payment_date}`);
		console.log(`\x1b[90m│\x1b[0m  \x1b[90mLast Tx:\x1b[0m  ${sub.latest_transaction_date ?? 'none yet'}`);
		console.log(`\x1b[90m└${'─'.repeat(42)}\x1b[0m\n`);
	});
};

// @TODO: Implement support of price history,and use data from it, not from `current_price`
const generatePhantomTransaction = (subscription: PreparedSubscriptionT, nextPaymentDate: Date): PreparedDbTxT => {
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
		category: subscription.category,
		color: subscription.color
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
			futureTxs.push(generatePhantomTransaction(subscription, nextDate));
			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
		}
	}

	return futureTxs;
};

const useCreatePhantomTxs = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const preparedSubscriptions = useSubscriptionsQuery();
	const maxDate = useMaxDate(preparedSubscriptions);

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

	return futureTxs;
};

export default useCreatePhantomTxs;
