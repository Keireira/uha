import * as Crypto from 'expo-crypto';
import { sharkieApi } from './api';

type GetRatesResponseT = {
	base: string; // ISO 4217 currency code, USD by default
	data: {
		date: string; // YYYY-MM-DD
		rates: Record<string, number>; // ISO 4217 currency code -> rate
	}[];
};

type QueryParamsT = {
	date: string;
	currencies?: string;
};

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
