import { useState, useEffect, useCallback } from 'react';
import Purchases, { type PurchasesStoreProduct } from 'react-native-purchases';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const TIP_PRODUCT_IDS = ['small_fry', 'good_catch', 'big_fish', 'whale'];

const useTipJar = () => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);

	const [products, setProducts] = useState<PurchasesStoreProduct[]>([]);
	const [purchasing, setPurchasing] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const fetched = await Purchases.getProducts(TIP_PRODUCT_IDS);
				setProducts(fetched.sort((a, b) => a.price - b.price));
			} catch (error) {
				console.error('Failed to fetch tip products:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const purchaseTip = useCallback(
		async (product: PurchasesStoreProduct) => {
			try {
				setPurchasing(product.identifier);
				await Purchases.purchaseStoreProduct(product);
				Toast.show({ type: 'success', text1: t('settings.tip_jar.thanks') });
			} catch (error: any) {
				if (!error.userCancelled) {
					Toast.show({ type: 'error', text1: t('settings.tip_jar.error') });
				}
			} finally {
				setPurchasing(null);
			}
		},
		[t]
	);

	return { products, isLoading, purchasing, purchaseTip };
};

export default useTipJar;
