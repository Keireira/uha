import { useCallback, useSyncExternalStore } from 'react';
import { useAsyncDebouncer } from '@tanstack/react-pacer';
import { sort } from 'ramda';

import { searchService } from '@api/soup';

import type { SearchResultT, SourceT } from '@api/soup/soup.d';

const DEBOUNCE_MS = 300;
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

type SearchState = {
	query: string;
	results: SearchResultT[];
};

let state: SearchState = { query: '', results: [] };
const listeners = new Set<() => void>();

const getSnapshot = () => state;

const setState = (next: Partial<SearchState>) => {
	state = { ...state, ...next };
	listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

const useSearch = () => {
	const snap = useSyncExternalStore(subscribe, getSnapshot);

	const debouncer = useAsyncDebouncer(
		async (trimmed: string) => {
			const data = await searchService(trimmed);

			setState({ results: processResults(data) });
		},
		{
			wait: DEBOUNCE_MS,
			onError: () => setState({ results: [] })
		},
		(s) => ({
			isPending: s.isPending,
			isExecuting: s.isExecuting
		})
	);

	const runSearch = useCallback(
		(text: string) => {
			const trimmedText = text.trim();

			setState({ query: trimmedText });

			if (text.length < 2) {
				debouncer.cancel();
				setState({ results: [] });

				return;
			}

			debouncer.maybeExecute(trimmedText);
		},
		[debouncer]
	);

	return {
		query: snap.query,
		results: snap.results,
		runSearch,
		isLoading: debouncer.state.isPending || debouncer.state.isExecuting
	};
};

export default useSearch;
