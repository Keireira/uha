import { getHttpClient } from '@lib/http-client';
import type { IRequestOpts } from '@lib/http-client/types.d';

const SHARKIE_API_URL = 'https://sharkie.uha.appp';

const getDefaultHeaders = () => ({
	'Content-Type': 'application/json',
	Accept: 'application/json'
});

const httpClient = getHttpClient({
	getDefaultHeaders
});

export const sharkieApi = <T>(path: string, params: IRequestOpts): Promise<T> =>
	httpClient<T>(`${SHARKIE_API_URL}${path}`, params);
