import { useMemo } from 'react';
import { useLocales } from 'expo-localization';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useSettingsValue } from './use-settings';
import { FREE_TIER, UNLIMITED_TIER, FREE_CURRENCY_BASE, type EntitlementT } from '@lib/entitlement';

export const useEntitlement = (): EntitlementT => {
	const isUnlimited = useSettingsValue<boolean>('is_unlimited') ?? false;

	return {
		isUnlimited,
		tier: isUnlimited ? UNLIMITED_TIER : FREE_TIER
	};
};

export const useFeatureGate = () => {
	const { isUnlimited } = useEntitlement();
	const router = useRouter();

	const gate = (action: () => void) => {
		if (isUnlimited) {
			action();
			return;
		}

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
		router.push('/(crossroad)/paywall');
	};

	return gate;
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
