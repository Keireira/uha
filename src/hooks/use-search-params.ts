import { useEffect, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';

export type SearchParamsT = {
	tx_view_mode?: 'list' | 'calendar' | 'subscriptions';
	calendar_scale?: 'year' | 'month';
};

const useSearchParams = () => {
	const [lastTxViewMode, setLastTxViewMode] = useState('list');
	const [lastCalendarScale, setLastCalendarScale] = useState<'year' | 'month'>('month');
	const { tx_view_mode, calendar_scale } = useGlobalSearchParams<SearchParamsT>();

	/**
	 * Roundabout way to help with useGlobalSearchParams behavior
	 * (When we call [transactionId] route, params reset)
	 */
	useEffect(() => {
		if (tx_view_mode) {
			setLastTxViewMode(tx_view_mode);
		}
	}, [tx_view_mode]);

	useEffect(() => {
		if (calendar_scale) {
			setLastCalendarScale(calendar_scale);
		}
	}, [calendar_scale]);

	return {
		txViewMode: tx_view_mode ?? lastTxViewMode,
		calendarScale: calendar_scale ?? lastCalendarScale
	};
};

export default useSearchParams;
