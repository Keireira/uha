import { useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

import { useSettingsValue, setSettingsValue } from './use-settings';
import { FREE_TIER, UNLIMITED_TIER, type EntitlementT } from '@lib/entitlement';

export const useEntitlement = (): EntitlementT => {
	const isUnlimited = useSettingsValue<boolean>('is_unlimited') ?? false;

	useEffect(() => {
		const checkEntitlements = async () => {
			try {
				const customerInfo = await Purchases.getCustomerInfo();
				const hasUnlimited = Boolean(customerInfo.entitlements.active['Uha Unlimited']);
				setSettingsValue('is_unlimited', hasUnlimited);
			} catch (e) {
				console.error(e);
			}
		};

		checkEntitlements();
	}, []);

	return {
		isUnlimited,
		tier: isUnlimited ? UNLIMITED_TIER : FREE_TIER
	};
};

export const useFeatureGate = () => {
	const { isUnlimited } = useEntitlement();

	const presentPaywall = useCallback(async () => {
		try {
			const result = await RevenueCatUI.presentPaywallIfNeeded({
				requiredEntitlementIdentifier: 'Uha Unlimited'
			});

			switch (result) {
				case PAYWALL_RESULT.PURCHASED:
				case PAYWALL_RESULT.RESTORED: {
					setSettingsValue('is_unlimited', true);
					return true;
				}

				default:
					return false;
			}
		} catch (error) {
			console.error('Paywall error:', error);
			return false;
		}
	}, []);

	const checkTheGate = useCallback(
		(action?: () => void) => {
			if (isUnlimited) {
				if (typeof action === 'function') action();

				return;
			}

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			presentPaywall();
		},
		[presentPaywall, isUnlimited]
	);

	return checkTheGate;
};
