import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import CategoryDetail from '@screens/library/categories/detail';
import ServiceDetail from '@screens/library/services/detail';
import PaymentDetail from '@screens/library/payments/detail';

const screens = {
	category: CategoryDetail,
	service: ServiceDetail,
	payment: PaymentDetail
} as const;

type EntityType = keyof typeof screens;

const LibraryDetail = () => {
	const { type } = useLocalSearchParams<{ id: string; type: EntityType }>();
	const Screen = screens[type] ?? null;

	return Screen ? <Screen /> : null;
};

export default LibraryDetail;
