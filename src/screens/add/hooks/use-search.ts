import { useCallback, useSyncExternalStore } from 'react';
import { useAsyncDebouncer } from '@tanstack/react-pacer';
import { sort } from 'ramda';

import { searchService } from '@api/soup';
import { useSettingsValue } from '@hooks';

import type { SearchResultT, SourceT } from '@api/soup/soup.d';

type SearchState = {
	query: string;
	results: SearchResultT[];
	isLoading: boolean;
};

const DEBOUNCE_MS = 250;

const SOURCE_PRIORITY: Record<SourceT, number> = {
	inhouse: 0,
	web: 1,
	appstore: 2,
	brandfetch: 3,
	playstore: 4,
	logodev: 5
};

const processResults = (results: SearchResultT[], searchSources: SourceT[]) => {
	const filtered = results.filter((r) => r.source === 'inhouse' || searchSources.includes(r.source));

	const sorted = sort(
		(a: SearchResultT, b: SearchResultT) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source],
		filtered
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
	const searchSources = useSettingsValue<SourceT[]>('search_sources');
	const appStoreCountry = useSettingsValue<string>('appstore_country');
	const playStoreCountry = useSettingsValue<string>('playstore_country');
	const language = useSettingsValue<string>('playstore_lang');
	const snapshot = useSyncExternalStore(subscribe, () => state);

	const debouncer = useAsyncDebouncer(
		async (trimmedSearchText: string) => {
			setState({ isLoading: true });

			const data = await searchService(trimmedSearchText, {
				playstore_country: playStoreCountry,
				app_store_country: appStoreCountry,
				sources: searchSources.join(',') as SourceT,
				language
			});

			setState({
				results: processResults(data, searchSources),
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
