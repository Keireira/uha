import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useSettingsValue, setSettingsValue } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import type { SearchParamsT } from '../select-currency.d';

const useSettingsDefaultCurrency = () => {
	const router = useRouter();
	const value = useSettingsValue<string>('default_currency');

	const action = (code: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setSettingsValue('default_currency', code);
		router.back();
	};

	return [value, action];
};

const useSettingsRecalcCurrency = () => {
	const router = useRouter();
	const value = useSettingsValue<string>('recalc_currency');

	const action = (code: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setSettingsValue('recalc_currency', code);
		router.back();
	};

	return [value, action];
};

const useAddSubscriptionCurrency = () => {
	const router = useRouter();
	const value = useDraftStore((state) => state.currency);
	const setCurrency = useDraftStore((state) => state.actions.setCurrency);

	const action = (code: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setCurrency(code);
		router.back();
	};

	return [value, action];
};

const useParams = () => {
	const { target } = useLocalSearchParams<SearchParamsT>();

	const hook = useMemo(() => {
		switch (target) {
			case 'settings_default_currency':
				return useSettingsDefaultCurrency;
			case 'settings_recalc_currency':
				return useSettingsRecalcCurrency;
			case 'add_subscription_currency':
				return useAddSubscriptionCurrency;
			default:
				return null;
		}
	}, [target]);

	return hook ? hook() : [];
};

export default useParams;
