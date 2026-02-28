import { useState, useCallback } from 'react';

// TODO: integrate RevenueCat SDK
const usePaywall = () => {
	const [isLoading] = useState(false);
	const [purchasing] = useState<string | null>(null);

	const purchase = useCallback(async () => {}, []);
	const restore = useCallback(async () => {}, []);

	return {
		monthly: null,
		annual: null,
		lifetime: null,
		isLoading,
		purchasing,
		purchase,
		restore
	};
};

export default usePaywall;
