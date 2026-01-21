import { useLocalSearchParams } from 'expo-router';

export type SearchParamsT = {
	tx_view_mode?: 'list' | 'calendar' | 'subscriptions';
};

const useSearchParams = () => {
	const { tx_view_mode } = useLocalSearchParams<SearchParamsT>();

	return {
		txViewMode: tx_view_mode || 'list'
	};
};

export default useSearchParams;
