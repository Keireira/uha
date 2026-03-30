import { getHttpClient } from '@lib/http-client';

import type { IRequestOpts } from '@lib/http-client/types.d';

/* Currency rates */
const SHARKIE_API_URL = 'https://sharkie.uha.app';
/* Search and get brand's related meta */
const SOUP_API_URL = 'https://soup.uha.app';

const getDefaultHeaders = () => ({
	'Content-Type': 'application/json',
	Accept: 'application/json'
});

const httpClient = getHttpClient({
	getDefaultHeaders
});

export const sharkieApi = <T>(path: string, params: IRequestOpts): Promise<T> =>
	httpClient<T>(`${SHARKIE_API_URL}${path}`, params);

export const soupApi = <T>(path: string, params: IRequestOpts): Promise<T> =>
	httpClient<T>(`${SOUP_API_URL}${path}`, params);
