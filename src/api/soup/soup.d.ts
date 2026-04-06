export type SourceT = 'inhouse' | 'brandfetch' | 'logo.dev' | 'appstore' | 'playstore' | 'web';

/* GET /search */
export type SearchQueryT = {
	q: string;
	sources: 'all' | 'external' | 'mobile' | SourceT;
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
	category_slug?: string;
};

export type SearchResponseT = SearchResultT[];

/* GET /service/:service_id */
export type ServiceQueryT = {
	source_hint?: SourceT;
	country?: string;
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
