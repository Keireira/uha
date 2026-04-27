import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';
import searchService from './search';

import type { ServiceResponseT, ServiceQueryT } from './soup.d';

export { searchService };

// serviceId has to be a valid service ID OR a valid bundle ID. Not a some random ID
export const getService = (serviceId: string, additionalParams?: ServiceQueryT) => {
	const queryParams: ServiceQueryT = additionalParams || {};

	const request = soupApi<ServiceResponseT>(`/service/${serviceId}`, {
		traceId: Crypto.randomUUID(),
		method: 'get',
		params: {
			queryParams
		}
	});

	return request satisfies Promise<ServiceResponseT>;
};
