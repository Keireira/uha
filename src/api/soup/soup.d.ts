import type appJson from '@src/../app.json';

export type LocaleT = keyof typeof appJson.expo.locales;

export type ColorT = {
	primary: string;
};

export enum LINK_TYPE {
	WEBSITE = 'website',
	X = 'x',
	GITHUB = 'github',
	LINKEDIN = 'linkedin'
}

type Response<T> =
	| {
			status: 'success';
			data: T;
	  }
	| {
			status: 'error';
			code: 400 | 404 | 500;
			message: string;
	  };

/* GET /search */
export type SearchQueryT = {
	q: string;
	/* Max 10 results */
	count?: number;
	/* empty means search by every locale */
	locales?: LocaleT[] | LocaleT;
};

export type SearchResultT = {
	id: string;
	name: string;
	colors?: ColorT;
	logo_url?: string;
};

export type SearchResponseT = Response<SearchResultT[]>;

/* GET /service/:service_id */
export type ServiceQueryT = undefined;

export type ServiceResponseT = Response<{
	id: string;
	name: string;
	colors: ColorT;
	category_id: string; // Мэтч на дефолтную категорию
	logo_url: string;
	links: Record<LINK_TYPE, string>;
	localizations: Record<LocaleT, string>;
	default_locale: LocaleT;
	ref_link: string | undefined;
}>;

/* GET /init */
export type InitQueryT = {
	locale: LocaleT;
};

export type InitResponseT = Response<ServiceResponseT[]>;
