import { useEffect, useMemo, useCallback } from 'react';
import { useLocales } from 'expo-localization';
import * as Haptics from 'expo-haptics';
import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

import { useSettingsValue, setSettingsValue } from './use-settings';
import { FREE_TIER, UNLIMITED_TIER, FREE_CURRENCY_BASE, type EntitlementT } from '@lib/entitlement';

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

	const checkTheGate = useCallback(() => {
		if (isUnlimited) return;

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

		presentPaywall();
	}, [presentPaywall, isUnlimited]);

	return checkTheGate;
};

export const useFreeCurrencies = (): string[] => {
	const locales = useLocales();
	const localeCurrency = locales[0]?.currencyCode;

	return useMemo(() => {
		const codes = [...FREE_CURRENCY_BASE];

		if (localeCurrency && !codes.includes(localeCurrency as (typeof FREE_CURRENCY_BASE)[number])) {
			codes.push(localeCurrency);
		}

		return codes;
	}, [localeCurrency]);
};
