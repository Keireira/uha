import { useState, useEffect } from 'react';
import Purchases, { type PurchasesOffering } from 'react-native-purchases';

const useOfferings = () => {
	const [offering, setOffering] = useState<PurchasesOffering | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOfferings = async () => {
			try {
				const offerings = await Purchases.getOfferings();
				setOffering(offerings.current);
			} catch (error) {
				console.error('Failed to fetch offerings:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOfferings();
	}, []);

	return { offering, isLoading };
};

export default useOfferings;
