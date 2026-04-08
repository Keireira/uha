import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';
import searchService from './search';

import type { ServiceResponseT, ServiceQueryT } from './soup.d';

export { searchService };

export const getService = (
	serviceId: string,
	sourceHint?: ServiceQueryT['source_hint'],
	country?: string,
	language?: string
) => {
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
