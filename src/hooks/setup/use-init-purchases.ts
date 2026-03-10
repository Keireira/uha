import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { setSettingsValue } from '../use-settings';

import type { CustomerInfo } from 'react-native-purchases';

const useInitPurchases = () => {
	useEffect(() => {
		Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.INFO : LOG_LEVEL.ERROR);
		const iosApiKey = process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY ?? '';

		console.info('[PLATFORM]:', Platform.OS);
		console.info('[iOS Key]:', iosApiKey);

		if (Platform.OS === 'ios') {
			Purchases.configure({ apiKey: iosApiKey });
		}
	}, []);

	useEffect(() => {
		const onCustomerInfoUpdate = (customerInfo: CustomerInfo) => {
			setSettingsValue('is_unlimited', Boolean(customerInfo.entitlements.active['Uha Unlimited']));
		};

		Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);

		return () => {
			Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
		};
	}, []);
};

export default useInitPurchases;
