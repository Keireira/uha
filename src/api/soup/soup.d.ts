export type SourceT = 'inhouse' | 'brandfetch' | 'logo.dev' | 'appstore' | 'playstore' | 'web';

/* GET /search */
export type SearchOptions = {
	sources?: SourceT[];
	app_store_country?: string;
	playstore_country?: string;
	language?: string;
};

export type SearchQueryT = {
	q: string;
	sources: string;
	app_store_country?: string;
	playstore_country?: string;
	language?: string;
};

export type SearchResultT = {
	id: string;
	logo_url: string;
	name: string;
	domains: string[];
	source: SourceT;
	bundle_id?: string;
	slug?: string;
	category_slug?: string;
	colors?: {
		primary?: string;
	};
	ref_link?: string | null;
	alternative_names?: string[];
	social_links?: Record<string, string>;
};

export type SearchResponseT = SearchResultT[];

/* GET /service/:service_id */
export type ServiceQueryT = {
	// External source for exact lookup: appstore, playstore, or web only.
	source_hint?: SourceT;
	// Country code, works with source_hint=appstore|playstore (default: US)
	country?: string;
	// Language code for results from store. Works with source_hint=playstore (default: en)
	language?: string;
};

export type ServiceResponseT = {
	id: string;
	name: string;
	slug: string;
	bundle_id: string;
	domains: string[];
	alternative_names: string[];
	tags: string[];
	verified: boolean;
	category_slug: string;
	colors: {
		primary: string;
	};
	social_links: Record<string, string>;
	logo_url: string;
	ref_link: string | null;
};
