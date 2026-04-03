import * as Crypto from 'expo-crypto';
import { splitEvery } from 'ramda';
import { useSettingsValue } from '@hooks';
import { startOfToday, addYears, endOfYear } from 'date-fns';
import { advanceDate } from '@hooks/use-transactions/utils';

import db from '@db';
import { transactionsTable } from '@db/schema';

import type { TransactionT, SubscriptionT } from '@models';

export const useGenerateTxs = () => {
	const maxHorizon = useSettingsValue<number>('max_horizon');

	const generateSubscriptionTxs = async (subscription: SubscriptionT) => {
		const today = startOfToday();
		const horizon = endOfYear(addYears(today, maxHorizon));

		let nextDate = new Date(subscription.first_payment_date);
		const cancellation = subscription.cancellation_date ? new Date(subscription.cancellation_date) : null;

		if (cancellation && cancellation < horizon) return;

		const txs: TransactionT[] = [];

		while (nextDate < horizon) {
			txs.push({
				id: Crypto.randomUUID(),
				amount: subscription.current_price,
				date: nextDate.toISOString(),
				currency_id: subscription.current_currency_id,
				tender_id: subscription.tender_id || '',
				subscription_id: subscription.id,
				comment: ''
			});

			nextDate = advanceDate(nextDate, subscription.billing_cycle_type, subscription.billing_cycle_value);
		}

		if (txs.length === 0) return;

		const batches = splitEvery(150, txs);

		for (const batch of batches) {
			await db.insert(transactionsTable).values(batch);
		}
	};

	return generateSubscriptionTxs;
};

export default useGenerateTxs;
