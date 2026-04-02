import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';

import type { SearchQueryT, SearchResponseT, ServiceResponseT } from './soup.d';

export const searchService = (query: SearchQueryT['q'], sources?: SearchQueryT['sources']) => {
	const queryParams: SearchQueryT = {
		q: query,
		sources: sources ?? 'all'
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

export const getService = (serviceId: string) => {
	const request = soupApi<ServiceResponseT>(`/service/${serviceId}`, {
		traceId: Crypto.randomUUID(),
		method: 'get'
	});

	return request satisfies Promise<ServiceResponseT>;
};
