import { useState } from 'react';

// TODO: integrate RevenueCat SDK
const useOfferings = () => {
	const [offering] = useState(null);
	const [isLoading] = useState(false);

	return { offering, isLoading };
};

export default useOfferings;
