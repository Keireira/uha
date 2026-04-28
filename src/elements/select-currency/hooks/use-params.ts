import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useSettingsValue, setSettingsValue } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { selectCurrencyId } from '@screens/crossroad/add-subscription/events';

import type { SearchParamsT } from '../select-currency.d';

type ParamsBinding = {
	currentValue: string;
	commit: (code: string) => void;
};

const useParams = (): ParamsBinding => {
	const router = useRouter();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const recalcCurrency = useSettingsValue<string>('recalc_currency');
	const defaultCurrency = useSettingsValue<string>('default_currency');
	const draftCurrency = useDraftStore((state) => selectCurrencyId(state.timeline));
	const setDraftCurrency = useDraftStore((state) => state.actions.setCurrencyId);

	switch (target) {
		case 'settings_default_currency':
			return {
				currentValue: defaultCurrency,
				commit: (code) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					setSettingsValue('default_currency', code);
					router.back();
				}
			};

		case 'settings_recalc_currency':
			return {
				currentValue: recalcCurrency,
				commit: (code) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					setSettingsValue('recalc_currency', code);
					router.back();
				}
			};

		case 'add_subscription_currency':
			return {
				currentValue: draftCurrency || '',
				commit: (code) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

					setDraftCurrency(code);
					router.back();
				}
			};

		default:
			throw new Error(`Unknown currency target: ${target}`);
	}
};

export default useParams;
