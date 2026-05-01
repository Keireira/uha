import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { ServiceDetails } from '@screens/library/services';
import { PaymentDetails } from '@screens/library/payments';
import { CategoryDetails } from '@screens/library/categories';
import { SubscriptionDetails } from '@screens/library/subscriptions';

const screens = {
	service: ServiceDetails,
	payment: PaymentDetails,
	category: CategoryDetails,
	subscription: SubscriptionDetails
} as const;

type LocalSearchParams = {
	id: string;
	type: keyof typeof screens;
};

const LibraryDetails = () => {
	const { type } = useLocalSearchParams<LocalSearchParams>();
	const Screen = screens[type] ?? null;

	return Screen ? <Screen /> : null;
};

export default LibraryDetails;
