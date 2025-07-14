import { fetch } from 'expo/fetch';
import { bind, extend } from './utils';

import type { IErrorMetaInfo, IQueryParams, IRequestOpts } from './types.d';

type requestArgs = [string, IRequestOpts?];
type RequestInterceptor = (...args: requestArgs) => requestArgs;
type ResponseInterceptor = ({ url, status }: { url: string; status: number }) => void;

const METHODS_ACCEPT_BODY = ['post', 'put', 'delete', 'patch'];

export type HttpClientT = HttpClient & {
	<T>(apiUrl: string, opts?: IRequestOpts): Promise<T>;
};

export function handlePathPlaceholders(apiUrl: string, pathParams: IQueryParams['pathParams']): string {
	if (!pathParams) return apiUrl;

	return Object.entries(pathParams).reduce(
		(acc: string, [pathKey, value]: [string, string]) => acc.replace(`{${pathKey}}`, value),
		apiUrl
	);
}

export function handleQueryParams(apiUrl: string, queryParams: IQueryParams['queryParams']): string {
	if (!queryParams) return apiUrl;

	const paramString = Object.entries(queryParams)
		.map(([key, val]) => `${key}=${val}`)
		.join('&');

	return `${apiUrl}?${paramString}`;
}

const defaultErrorHandler = (meta: IErrorMetaInfo) => {
	return new Error(
		JSON.stringify({
			status: meta.status,
			statusText: meta.statusText,
			url: meta.url,
			traceId: meta?.traceId,
			body: meta?.body
		})
	);
};

const getFilenameFromContentDispositionHeader = (header: string | null) => {
	if (header === null) return '';

	const contentDisposition = header?.split(';');
	const fileNameToken = `filename*=UTF-8''`;

	const fileName = contentDisposition
		.find((value) => value.includes(fileNameToken))
		?.trim()
		?.replace(fileNameToken, '');

	return fileName ?? '';
};

interface IClientSettings {
	getToken?: () => Promise<string | null | undefined>;
	getDefaultHeaders?: () => Record<string, string>;
	errorHandler?: (meta: IErrorMetaInfo) => Error;
}

const defaultParseBody = async (response: Response) => {
	const contentType = response.headers.get('content-type');
	const isText = contentType?.startsWith('text');
	if (!contentType) return null;
	if (isText) return response.text();
	return response.json();
};

type ErrorHandler = (meta: IErrorMetaInfo) => Error;
type GetToken = () => Promise<string | null | undefined>;
type GetDefaultHeaders = () => Record<string, string>;

type HttpClientOptions = {
	errorHandler?: ErrorHandler;
	getToken?: GetToken;
	getDefaultHeaders?: GetDefaultHeaders;
};

class HttpClient {
	interceptors: {
		request: Set<RequestInterceptor>;
		response: Set<ResponseInterceptor>;
	} = {
		request: new Set(),
		response: new Set()
	};

	constructor(
		private readonly errorHandler: ErrorHandler = defaultErrorHandler,
		private readonly getToken?: GetToken,
		private readonly getDefaultHeaders?: GetDefaultHeaders
	) {}

	private _getHeaders(options?: HttpClientOptions): Record<string, string> {
		const getter = options?.getDefaultHeaders ?? this.getDefaultHeaders;
		return getter ? getter() : {};
	}

	private async _getToken(options?: HttpClientOptions): Promise<string | null | undefined> {
		const getter = options?.getToken ?? this.getToken;
		return getter && (await getter());
	}

	private _errorHandler(error: IErrorMetaInfo, options?: HttpClientOptions) {
		const handler = options?.errorHandler ?? this.errorHandler;
		return handler(error);
	}

	async request<T>(_apiUrl = '', _opts?: IRequestOpts, clientOptions?: HttpClientOptions): Promise<T> {
		let apiUrl = _apiUrl;
		let opts = _opts;

		this.interceptors.request.forEach((interceptor) => {
			[apiUrl, opts] = interceptor(apiUrl, opts);
		});

		const pathReplacedUrl = handlePathPlaceholders(apiUrl, opts?.params?.pathParams);
		const urlWithQueryParams = handleQueryParams(pathReplacedUrl, opts?.params?.queryParams);
		const token = opts?.token ? opts.token : await this._getToken(clientOptions);
		const authHeader = { Authorization: `Bearer ${token || ''}` };

		const defaultHeaders = this._getHeaders(clientOptions);
		const baseFetchConfig = {
			method: opts?.method || 'get',
			signal: opts?.signal,
			headers: opts?.headers
				? { ...authHeader, ...defaultHeaders, ...opts?.headers }
				: { ...authHeader, ...defaultHeaders, 'Content-Type': 'application/json' }
		};

		const fetchConfig =
			METHODS_ACCEPT_BODY.includes(baseFetchConfig.method.toLowerCase()) && opts?.params?.body
				? { ...baseFetchConfig, body: opts.params.body }
				: baseFetchConfig;

		fetchConfig.method = fetchConfig.method.toUpperCase() as NonNullable<IRequestOpts['method']>;

		const bodyParse = opts?.bodyParse ?? defaultParseBody;

		return await fetch(urlWithQueryParams, fetchConfig)
			.then(async (response) => {
				let body;

				if (opts?.blobResponse) {
					body = {
						blob: await response.blob(),
						name: getFilenameFromContentDispositionHeader(response.headers.get('content-disposition'))
					};
				} else {
					body = await bodyParse(response);
				}

				this.interceptors.response.forEach((interceptor) => {
					interceptor({ url: response.url, status: response.status });
				});

				if (response.status >= 400) {
					const errorMetaInfo: IErrorMetaInfo = {
						status: response.status,
						statusText: response.statusText,
						traceId: response.headers.get('traceId') || opts?.traceId,
						body,
						url: response.url
					};

					throw new Error(JSON.stringify(errorMetaInfo));
				}

				return opts?.needFullResponse ? response : body;
			})
			.catch((error: ErrorEvent) => {
				if (opts?.errorHandler) {
					opts?.errorHandler(error);
				} else {
					let errObj;
					try {
						errObj = JSON.parse(error.message);
					} catch {
						throw error;
					}
					throw this._errorHandler(errObj, clientOptions);
				}
			});
	}
}

export const baseHttpClient = createHttpClient();

function createHttpClient(): HttpClientT {
	const context = new HttpClient();
	const instance = bind(HttpClient.prototype.request, context);
	extend(instance, HttpClient.prototype, context, { allOwnKeys: true });
	extend(instance, context, null, { allOwnKeys: true });
	// @ts-ignore
	return instance;
}

export const getHttpClient = ({ errorHandler = defaultErrorHandler, getToken, getDefaultHeaders }: IClientSettings) => {
	return <T>(apiUrl: string, opts?: IRequestOpts) => {
		return baseHttpClient.request<T>(apiUrl, opts, { errorHandler, getToken, getDefaultHeaders });
	};
};
