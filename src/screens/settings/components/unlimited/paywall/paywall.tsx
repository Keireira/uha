import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';

import { setSettingsValue } from '@hooks';

const PaywallScreen = () => {
	const router = useRouter();

	return (
		<View style={{ flex: 1 }}>
			<RevenueCatUI.Paywall
				onDismiss={() => router.back()}
				onPurchaseCompleted={({ customerInfo }) => {
					if (customerInfo.entitlements.active['Uha Unlimited']) {
						setSettingsValue('is_unlimited', true);
					}
				}}
				onRestoreCompleted={({ customerInfo }) => {
					if (customerInfo.entitlements.active['Uha Unlimited']) {
						setSettingsValue('is_unlimited', true);
					}
				}}
			/>
		</View>
	);
};

export default PaywallScreen;
