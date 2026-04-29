import { useState, useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams } from 'expo-router';
import db from '@db';
import { eq } from 'drizzle-orm';
import { getService } from '@api/soup';
import { servicesTable } from '@db/schema';
import type { ServiceT } from '@models';
import type { ServiceQueryT, SearchResultT } from '@api/soup';

type RouteParams = {
	service_id?: SearchResultT['id'];
	service_logo?: SearchResultT['logo_url'];
	service_symbol?: string;
	service_name?: SearchResultT['name'];
	service_source?: SearchResultT['source'];
	service_bundle_id?: SearchResultT['bundle_id'];
	service_slug?: SearchResultT['slug'];
	service_color?: string;
	service_ref_link?: string;
	service_category_slug?: SearchResultT['category_slug'];
	service_domains?: string;
	service_aliases?: string;
	service_social_links?: string;
} & Partial<ServiceQueryT>;

type LoadedRouteParams = RouteParams & {
	service_id: SearchResultT['id'];
};

type ResolvedServiceT = {
	service: ServiceT;
	localService: ServiceT | null;
};

const DEFAULT_SERVICE: ServiceT = {
	id: '',
	logo_url: '',
	bundle_id: '',
	slug: '',
	title: '',
	color: '',
	symbol: null,
	ref_link: '',
	domains: [],
	social_links: {},
	aliases: [],
	category_slug: ''
};

// I can't access extended data for service via brandfetch or logo.dev APIs since their heavy paywall restrictions.
// Though, honestly their data is low quality, with 50 maybe 60 percents of useful hits here
const REMOTE_SOURCES = new Set<SearchResultT['source']>([
	'inhouse',
	'appstore',
	'playstore',
	'web',
	'brandfetch',
	'logo.dev'
]);

const createDefaultService = (): ServiceT => ({
	...DEFAULT_SERVICE,
	id: Crypto.randomUUID()
});

const parseDomains = (raw: unknown): string[] => {
	if (Array.isArray(raw)) {
		return raw;
	}

	if (typeof raw === 'string') {
		try {
			return JSON.parse(raw);
		} catch {
			return raw ? [raw] : [];
		}
	}

	return [];
};

const parseStringArray = (raw: unknown): string[] => {
	if (Array.isArray(raw)) {
		return raw.filter((item): item is string => typeof item === 'string');
	}

	if (typeof raw !== 'string') {
		return [];
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
	} catch {
		return raw ? [raw] : [];
	}
};

const parseStringRecord = (raw: unknown): Record<string, string> => {
	if (typeof raw !== 'string') {
		return {};
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

		return Object.fromEntries(
			Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
		);
	} catch {
		return {};
	}
};

const isBlank = (value: string | null | undefined): boolean => !value?.trim();

const hasItems = (value: unknown[] | null | undefined): boolean => Array.isArray(value) && value.length > 0;

const hasKeys = (value: Record<string, string> | null | undefined): boolean =>
	Boolean(value && Object.keys(value).length > 0);

const fetchFromLocalDB = async (serviceId: string): Promise<ServiceT | null> => {
	const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));

	if (!row) {
		return null;
	}

	return {
		...row,
		logo_url: row.logo_url || (row.slug ? `https://s3.uha.app/logos/${row.slug}.webp` : '')
	};
};

const mergeWithLocalFallbacks = (external: ServiceT, local: ServiceT | null): ServiceT => {
	if (!local) return external;

	const externalLogoUrl = isBlank(external.logo_url) ? null : external.logo_url;
	const symbol = externalLogoUrl ? null : (external.symbol ?? local.symbol);

	return {
		id: local.id,
		bundle_id: isBlank(external.bundle_id) ? local.bundle_id : external.bundle_id,
		slug: isBlank(external.slug) ? local.slug : external.slug,
		title: isBlank(external.title) ? local.title : external.title,
		color: isBlank(external.color) ? local.color : external.color,
		logo_url: symbol ? null : (externalLogoUrl ?? local.logo_url),
		symbol,
		ref_link: isBlank(external.ref_link) ? local.ref_link : external.ref_link,
		domains: hasItems(external.domains) ? external.domains : local.domains,
		social_links: hasKeys(external.social_links) ? external.social_links : local.social_links,
		aliases: hasItems(external.aliases) ? external.aliases : local.aliases,
		category_slug: isBlank(external.category_slug) ? local.category_slug : external.category_slug
	};
};

const fetchFromRemote = async (params: LoadedRouteParams): Promise<ServiceT | null> => {
	const serviceId = params.service_bundle_id || params.service_id;

	if (!serviceId) {
		return null;
	}

	const query: ServiceQueryT = params.source_hint
		? {
				source_hint: params.source_hint,
				country: params.country,
				language: params.language
			}
		: {};

	const response = await getService(serviceId, query);

	return {
		id: response.id,
		logo_url: response.logo_url,
		bundle_id: response.bundle_id,
		slug: response.slug,
		title: response.name,
		color: response.colors?.primary ?? '',
		symbol: null,
		ref_link: response.ref_link,
		domains: response.domains,
		social_links: response.social_links,
		aliases: response.alternative_names,
		category_slug: response.category_slug
	};
};

const parseFromSearch = (params: RouteParams, local?: ServiceT | null): ServiceT => {
	const domains = parseDomains(params.service_domains);
	const bundle_id = params.service_bundle_id ?? domains[0] ?? '';
	const serviceId = local?.id ?? params.service_id ?? Crypto.randomUUID();

	return {
		...DEFAULT_SERVICE,
		id: serviceId,
		logo_url: params.service_logo ?? '',
		symbol: params.service_symbol ?? null,
		slug: params.service_slug ?? domains[0]?.replace(/\./g, '-') ?? serviceId,
		title: params.service_name ?? '',
		color: params.service_color ?? '',
		bundle_id,
		ref_link: params.service_ref_link ?? '',
		category_slug: params.service_category_slug ?? '',
		domains,
		aliases: parseStringArray(params.service_aliases),
		social_links: parseStringRecord(params.service_social_links)
	};
};

const resolveService = async (params: LoadedRouteParams): Promise<ResolvedServiceT> => {
	const local = await fetchFromLocalDB(params.service_id);
	let service: ServiceT;

	if (!params.service_source || !REMOTE_SOURCES.has(params.service_source)) {
		service = mergeWithLocalFallbacks(parseFromSearch(params, local), local);
	} else {
		try {
			const remote = await fetchFromRemote(params);
			service = mergeWithLocalFallbacks(remote ?? parseFromSearch(params, local), local);
		} catch {
			service = mergeWithLocalFallbacks(parseFromSearch(params, local), local);
		}
	}

	return { service, localService: local };
};

const useLoadService = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState<ServiceT>();
	const [localService, setLocalService] = useState<ServiceT | null>(null);
	const params = useLocalSearchParams<RouteParams>();
	const {
		service_id,
		service_logo,
		service_symbol,
		service_name,
		service_source,
		service_bundle_id,
		service_slug,
		service_color,
		service_ref_link,
		service_category_slug,
		service_domains,
		service_aliases,
		service_social_links,
		source_hint,
		country,
		language
	} = params;

	useEffect(() => {
		if (!service_id) {
			setService(createDefaultService());
			setLocalService(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		const loadedParams = {
			service_id,
			service_logo,
			service_symbol,
			service_name,
			service_source,
			service_bundle_id,
			service_slug,
			service_color,
			service_ref_link,
			service_category_slug,
			service_domains,
			service_aliases,
			service_social_links,
			source_hint,
			country,
			language
		};

		resolveService(loadedParams)
			.then((resolved) => {
				setService(resolved.service);
				setLocalService(resolved.localService);
			})
			.catch(() => {
				setService(createDefaultService());
				setLocalService(null);
			})
			.finally(() => setIsLoading(false));
	}, [
		service_id,
		service_logo,
		service_symbol,
		service_name,
		service_source,
		service_bundle_id,
		service_slug,
		service_color,
		service_ref_link,
		service_category_slug,
		service_domains,
		service_aliases,
		service_social_links,
		source_hint,
		country,
		language
	]);

	return { service, localService, isLoading };
};

export default useLoadService;
