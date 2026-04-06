import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';

import type { SearchQueryT, SearchResponseT, ServiceResponseT, ServiceQueryT } from './soup.d';

type SearchOptions = {
	sources?: SearchQueryT['sources'];
	app_store_country?: string;
	playstore_country?: string;
	language?: string;
};

export const searchService = (query: SearchQueryT['q'], options?: SearchOptions) => {
	const queryParams: SearchQueryT = {
		q: query,
		sources: options?.sources ?? 'all',
		app_store_country: options?.app_store_country,
		playstore_country: options?.playstore_country,
		language: options?.language
	};

	const request = soupApi<SearchResponseT>('/search', {
		traceId: Crypto.randomUUID(),
		method: 'get',
		params: {
			queryParams
		}
	});

	return request satisfies Promise<SearchResponseT>;
};

export const getService = (serviceId: string, sourceHint?: ServiceQueryT['source_hint'], country?: string, language?: string) => {
	const queryParams: ServiceQueryT = {};

	if (sourceHint) {
		queryParams.source_hint = sourceHint;
	}

	if (country) {
		queryParams.country = country;
	}

	if (language) {
		queryParams.language = language;
	}

	const request = soupApi<ServiceResponseT>(`/service/${serviceId}`, {
		traceId: Crypto.randomUUID(),
		method: 'get',
		params: {
			queryParams
		}
	});

	return request satisfies Promise<ServiceResponseT>;
};
