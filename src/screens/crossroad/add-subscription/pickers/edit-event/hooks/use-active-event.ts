import { useLocalSearchParams } from 'expo-router';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { isPricedEvent, selectCurrencyId } from '@screens/crossroad/add-subscription/events';

import type { EventTypeT } from '@screens/crossroad/add-subscription/events';

type SearchParamsT = {
	id?: string;
	type?: EventTypeT;
};

const useActiveEvent = () => {
	const { id, type: typeParam } = useLocalSearchParams<SearchParamsT>();

	const timeline = useDraftStore((state) => state.timeline);
	const defaultCurrency = useDraftStore((state) => selectCurrencyId(state.timeline) ?? state.default_currency_id);

	const activeEvent = id ? timeline.find((event) => event.id === id) : undefined;
	const activeType = activeEvent?.type ?? typeParam;

	const currency = activeEvent && isPricedEvent(activeEvent) ? activeEvent.currency_id : defaultCurrency;

	return {
		event: activeEvent,
		type: activeType,
		currency,
		timeline,
		id
	};
};

export default useActiveEvent;
