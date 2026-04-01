import * as Crypto from 'expo-crypto';

import { sharkieApi } from '../api';

import type { GetRatesResponseT, QueryParamsT } from './sharkie.d';

export const getHistoryRates = (dates: string[], currencies?: string[]) => {
	const queryParams: QueryParamsT = {
		date: dates.join(',')
	};

	if (currencies) {
		queryParams.currencies = currencies.join(',');
	}

	const request = sharkieApi<GetRatesResponseT>('/history', {
		traceId: Crypto.randomUUID(),
		method: 'get',
		params: {
			queryParams
		}
	});

	return request satisfies Promise<GetRatesResponseT>;
};
