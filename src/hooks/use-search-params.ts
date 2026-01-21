import { useEffect, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';

export type SearchParamsT = {
	tx_view_mode?: 'list' | 'calendar' | 'subscriptions';
};

const useSearchParams = () => {
	const [lastTxViewMode, setLastTxViewMode] = useState('list');
	const { tx_view_mode } = useGlobalSearchParams<SearchParamsT>();

	/*
	 * Roundabout way to help with useGlobalSearchParams behavior
	 * (When we call [transactionId] route, tx_view_mode resets)
	 */
	useEffect(() => {
		if (tx_view_mode) {
			setLastTxViewMode(tx_view_mode);
		}
	}, [tx_view_mode]);

	return {
		txViewMode: tx_view_mode ?? lastTxViewMode
	};
};

export default useSearchParams;
