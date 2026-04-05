import { useCallback, useSyncExternalStore } from 'react';
import { useAsyncDebouncer } from '@tanstack/react-pacer';
import { sort } from 'ramda';

import { searchService } from '@api/soup';

import type { SearchResultT, SourceT } from '@api/soup/soup.d';

type SearchState = {
	query: string;
	results: SearchResultT[];
	isLoading: boolean;
};

const DEBOUNCE_MS = 250;
const SOURCE_PRIORITY: Record<SourceT, number> = {
	local: 0,
	brandfetch: 1,
	'logo.dev': 2
};

const processResults = (results: SearchResultT[]): SearchResultT[] => {
	const sorted = sort(
		(a: SearchResultT, b: SearchResultT) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source],
		results
	);

	return sorted;
};

// @TODO: Use zustand here (and replace effector with zustand)
// this is miserable singleton
let state: SearchState = {
	query: '',
	results: [],
	isLoading: false
};

const listeners = new Set<() => void>();

const setState = (next: Partial<SearchState>) => {
	state = {
		...state,
		...next
	};

	listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
	listeners.add(listener);

	return () => listeners.delete(listener);
};

const useSearch = () => {
	const snapshot = useSyncExternalStore(subscribe, () => state);

	const debouncer = useAsyncDebouncer(
		async (trimmedSearchText: string) => {
			setState({ isLoading: true });

			const data = await searchService(trimmedSearchText);

			setState({
				results: processResults(data),
				isLoading: false
			});
		},
		{
			wait: DEBOUNCE_MS,
			leading: true,
			onError: () => setState({ results: [], isLoading: false })
		}
	);

	const runSearch = useCallback(
		(text: string) => {
			const trimmedText = text.trim();

			setState({
				query: trimmedText
			});

			if (text.length < 2) {
				debouncer.cancel();

				setState({
					results: [],
					isLoading: false
				});

				return;
			}

			debouncer.maybeExecute(trimmedText);
		},
		[debouncer]
	);

	return {
		runSearch,
		query: snapshot.query,
		results: snapshot.results,
		isFilled: snapshot.query.length >= 2,
		isSearchMode: snapshot.query.length > 1,
		isLoading: snapshot.isLoading
	};
};

export default useSearch;
