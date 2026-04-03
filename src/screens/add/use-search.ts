import { useState, useCallback } from 'react';
import { useAsyncDebouncer } from '@tanstack/react-pacer';
import { searchService } from '@api/soup';

import type { SearchResultT, SourceT } from '@api/soup/soup.d';

const DEBOUNCE_MS = 400;

const SOURCE_PRIORITY: Record<SourceT, number> = { local: 0, brandfetch: 1, 'logo.dev': 2 };

const processResults = (results: SearchResultT[]): SearchResultT[] => {
	const sorted = [...results].sort((a, b) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source]);

	const seen = new Set<string>();

	return sorted.filter((item) => {
		const key = item.name.toLowerCase().trim();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

const useSearch = () => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<SearchResultT[]>([]);

	const debouncer = useAsyncDebouncer(
		async (trimmed: string) => {
			const data = await searchService(trimmed);
			setResults(processResults(data));
		},
		{
			wait: DEBOUNCE_MS,
			onError: () => setResults([])
		},
		(state) => ({
			isPending: state.isPending,
			isExecuting: state.isExecuting
		})
	);

	const loading = debouncer.state.isPending || debouncer.state.isExecuting;

	const search = useCallback(
		(text: string) => {
			setQuery(text);

			const trimmed = text.trim();

			if (trimmed.length < 2) {
				debouncer.cancel();
				setResults([]);
				return;
			}

			debouncer.maybeExecute(trimmed);
		},
		[debouncer]
	);

	return { query, search, results, loading };
};

export default useSearch;
