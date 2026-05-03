import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';
import { searchAppStore } from './appstore';
import { normalizeDomain } from '@lib/url';

import type { SearchOptions, SearchQueryT, SearchResponseT, SearchResultT } from './soup.d';

/* Response handling */
const isKnown = (searchResult: SearchResultT, knownDomains: Set<string>) => {
	const result = searchResult.domains.some((url) => {
		const normalized = normalizeDomain(url);

		return knownDomains.has(normalized);
	});

	return result;
};

const getKnownDomains = (soupResults: SearchResultT[]) => {
	const knownDomains = new Set<string>();

	for (const result of soupResults) {
		for (const domain of result.domains) {
			knownDomains.add(normalizeDomain(domain));
		}
	}

	return knownDomains;
};

const deduplicate = (soupResults: SearchResultT[], appstoreResults: SearchResultT[]) => {
	const inhouse: SearchResultT[] = [];
	const restResults: SearchResultT[] = [];

	const knownDomains = getKnownDomains(soupResults);
	const newFromAppStore = appstoreResults.filter((result) => !isKnown(result, knownDomains));

	for (const result of soupResults) {
		if (result.source === 'inhouse') {
			inhouse.push(result);
		} else {
			restResults.push(result);
		}
	}

	return [...inhouse, ...newFromAppStore, ...restResults];
};

/* Request handling */
const prepareSources = (sources?: SearchOptions['sources']) => {
	const filteredSoupSources = sources?.filter((source) => source !== 'appstore') || [];

	return {
		withSoup: Boolean(filteredSoupSources.length),
		withAppStore: sources?.includes('appstore') ?? false,
		withGooglePlay: sources?.includes('playstore') ?? false,

		soupSources: sources ? filteredSoupSources.join(',') : 'all'
	};
};

const prepareRequests = (query: SearchQueryT['q'], options?: SearchOptions) => {
	const { withAppStore, withGooglePlay, withSoup, soupSources } = prepareSources(options?.sources);

	const queryParams: Partial<SearchQueryT> = {
		q: query
	};

	if (withSoup) {
		queryParams.sources = soupSources;
	}

	if (withGooglePlay && options) {
		queryParams.language = options.language;
		queryParams.playstore_country = options.playstore_country;
	}

	const soupRequest = withSoup
		? soupApi<SearchResponseT>('/search', {
				traceId: Crypto.randomUUID(),
				method: 'get',
				params: { queryParams }
			})
		: null;

	const appStoreRequest = withAppStore ? searchAppStore(query, options?.app_store_country) : null;

	return [soupRequest, appStoreRequest];
};

/* Master function */
const searchService = async (query: SearchQueryT['q'], options?: SearchOptions): Promise<SearchResponseT> => {
	const requests = prepareRequests(query, options);
	const [soupResult, appStoreResult] = await Promise.allSettled(requests);

	const soupResults = soupResult.status === 'fulfilled' ? soupResult.value : null;
	const appStoreResults = appStoreResult.status === 'fulfilled' ? appStoreResult.value : null;

	if (soupResults && appStoreResults) {
		return deduplicate(soupResults, appStoreResults);
	}

	if (soupResults) {
		return soupResults;
	}

	if (appStoreResults) {
		return appStoreResults;
	}

	throw new Error('Search failed');
};

export default searchService;
