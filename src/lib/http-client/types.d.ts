export interface IQueryParams {
	pathParams?: Record<string, string>;
	queryParams?: Record<string, string | number | string[] | number[] | boolean>;
	body?: Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array> | string;
}

export interface IErrorMetaInfo<B = unknown> extends Pick<Response, 'status' | 'statusText' | 'url'> {
	traceId?: string;
	body?: B;
}

export interface IRequestOpts {
	traceId: string;
	method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	params?: IQueryParams;
	headers?: Record<string, string>;
	token?: string;
	errorHandler?: (e: ErrorEvent) => Error;
	signal?: AbortSignal;
	needFullResponse?: boolean;
	blobResponse?: boolean;
	isTokenOptional?: boolean;
	bodyParse?: (response: Response) => any;
}

export declare type HttpClientT<T> = (apiUrl?: string, opts?: IRequestOpts | undefined) => Promise<T>;
