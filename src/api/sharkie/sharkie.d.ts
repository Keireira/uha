export type GetRatesResponseT = {
	base: string; // ISO 4217 currency code, USD by default
	data: {
		date: string; // YYYY-MM-DD
		rates: Record<string, number>; // ISO 4217 currency code -> rate
	}[];
};

export type QueryParamsT = {
	date: string;
	currencies?: string;
};
