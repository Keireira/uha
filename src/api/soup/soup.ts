import * as Crypto from 'expo-crypto';

import { soupApi } from '@api/api';

import type { InitQueryT, InitResponseT } from './soup.d';

export const getInitBrandsData = async (initLocale: InitQueryT['locale']) => {
	const queryParams: InitQueryT = {
		locale: initLocale
	};

	const request = soupApi<InitResponseT>('/init', {
		traceId: Crypto.randomUUID(),
		method: 'get',
		params: {
			queryParams
		}
	});

	return request satisfies Promise<InitResponseT>;
};
