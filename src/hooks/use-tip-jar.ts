import { useState } from 'react';

// TODO: integrate RevenueCat SDK
const useTipJar = () => {
	const [products] = useState<never[]>([]);
	const [isLoading] = useState(false);
	const [purchasing] = useState<string | null>(null);

	const purchaseTip = async () => {};

	return { products, isLoading, purchasing, purchaseTip };
};

export default useTipJar;
