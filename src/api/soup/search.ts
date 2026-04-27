import * as Crypto from 'expo-crypto';
import { soupApi } from '@api/api';
import { searchAppStore } from './appstore';
import type { SearchOptions, SearchQueryT, SearchResponseT, SearchResultT } from './soup.d';

const normalizeDomain = (d: string) => d.toLowerCase().replace(/^www\./, '');

const deduplicate = (fromSoup: SearchResultT[], appstore: SearchResultT[]): SearchResultT[] => {
	const inhouse: SearchResultT[] = [];
	const restResults: SearchResultT[] = [];

	const knownDomains = new Set(fromSoup.flatMap((r) => r.domains.map(normalizeDomain)));
	const isKnown = (r: SearchResultT) => r.domains.some((d) => knownDomains.has(normalizeDomain(d)));
	const newFromAppStore = appstore.filter((r) => !isKnown(r));

	for (const r of fromSoup) {
		(r.source === 'inhouse' ? inhouse : restResults).push(r);
	}

	return [...inhouse, ...newFromAppStore, ...restResults];
};

const prepareSources = (sources?: SearchOptions['sources']) => {
	const soupSources = sources ? sources.filter((s) => s !== 'appstore').join(',') : 'all';

	return {
		soupSources,
		withAppStore: !sources || sources.includes('appstore')
	};
};

const searchService = async (query: SearchQueryT['q'], options?: SearchOptions): Promise<SearchResponseT> => {
	const { withAppStore, soupSources } = prepareSources(options?.sources);

	const queryParams: SearchQueryT = {
		q: query,
		sources: soupSources,
		language: options?.language,
		playstore_country: options?.playstore_country
	};

	const [soupResults, appStoreResults] = await Promise.all([
		soupApi<SearchResponseT>('/search', {
			traceId: Crypto.randomUUID(),
			method: 'get',
			params: {
				queryParams
			}
		}),
		withAppStore ? searchAppStore(query, options?.app_store_country) : null
	]);

	return appStoreResults ? deduplicate(soupResults, appStoreResults) : soupResults;
};

export default searchService;
