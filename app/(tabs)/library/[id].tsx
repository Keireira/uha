import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import ServiceDetail from '@screens/library/services/detail';
import PaymentDetail from '@screens/library/payments/detail';
import CategoryDetail from '@screens/library/categories/detail';

const screens = {
	service: ServiceDetail,
	payment: PaymentDetail,
	category: CategoryDetail
} as const;

type EntityType = keyof typeof screens;

const LibraryDetail = () => {
	const { type } = useLocalSearchParams<{ id: string; type: EntityType }>();
	const Screen = screens[type] ?? null;

	return Screen ? <Screen /> : null;
};

export default LibraryDetail;
