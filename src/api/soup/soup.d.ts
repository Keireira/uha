type SourceT = 'local' | 'brandfetch' | 'logodev';

// type Response<T> =
// 	| {
// 			status: 'success';
// 			data: T;
// 	  }
// 	| {
// 			status: 'error';
// 			code: 400 | 404 | 500;
// 			message: string;
// 	  };

/* GET /search */
export type SearchQueryT = {
	q: string;
	sources: 'all' | 'external' | SourceT;
};

export type SearchResultT = {
	id: string;
	logo_url: string;
	name: string;
	domains: string[];
	source: SourceT;
};

export type SearchResponseT = SearchResultT[];
// export type SearchResponseT = Response<SearchResultT[]>;

/* GET /service/:service_id */
export type ServiceResponseT = {
	id: string;
	name: string;
	slug: string;
	bundle_id: string;
	description: string | null;
	domains: string[];
	alternative_names: string[];
	tags: string[];
	verified: boolean;
	category: {
		id: string;
		title: string;
	};
	colors: {
		primary: string;
	};
	social_links: Record<string, string>;
	logo_url: string;
	ref_link: string | null;
};
