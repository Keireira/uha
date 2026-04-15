import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';

import db from '@db';
import { subscriptionsTable, priceHistoryTable } from '@db/schema';
import { useGenerateTxs } from '@hooks/setup';

import type { SubscriptionT } from '@models';

type SaveParams = {
	service_id: string;
	category_slug: string;
	custom_name: string | null;
	custom_emoji: string | null;
	billing_cycle_type: SubscriptionT['billing_cycle_type'];
	billing_cycle_value: number;
	priceMinorUnits: number;
	currencyId: string;
	firstPaymentDate: string;
	tenderId: string | null;
};

const useSaveSubscriptions = () => {
	const router = useRouter();
	const generateSubscriptionTxs = useGenerateTxs();

	// 1. Save subscription
	// 2. Save initial price_history entry
	// 3. Generate subscription txs
	// 4. Go back
	const save = async (params: SaveParams) => {
		const subscriptionId = Crypto.randomUUID();

		await db.insert(priceHistoryTable).values({
			id: Crypto.randomUUID(),
			amount: params.priceMinorUnits,
			date: params.firstPaymentDate,
			currency_id: params.currencyId,
			subscription_id: subscriptionId
		});

		const subscription: SubscriptionT = {
			id: subscriptionId,
			service_id: params.service_id,
			category_slug: params.category_slug,
			custom_name: params.custom_name,
			custom_emoji: params.custom_emoji,
			billing_cycle_type: params.billing_cycle_type,
			billing_cycle_value: params.billing_cycle_value,
			first_payment_date: params.firstPaymentDate,
			tender_id: params.tenderId,
			cancellation_date: null
		};

		await db.insert(subscriptionsTable).values(subscription);

		await generateSubscriptionTxs(subscription);

		router.back();
	};

	return save;
};

export default useSaveSubscriptions;
