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
	service_id: SearchResultT['id'];
	service_logo?: SearchResultT['logo_url'];
	service_name: SearchResultT['name'];
	service_source: SearchResultT['source'];
	service_bundle_id?: SearchResultT['bundle_id'];
	service_slug?: SearchResultT['slug'];
	service_color?: string;
	service_ref_link?: string;
	service_category_slug?: SearchResultT['category_slug'];
	service_domains?: string;
	service_aliases?: string;
	service_social_links?: string;
} & Partial<ServiceQueryT>;

const DEFAULT_SERVICE: ServiceT = {
	id: '',
	logo_url: '',
	bundle_id: '',
	slug: '',
	title: '',
	color: '',
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

const fetchFromLocalDB = async (serviceId: string): Promise<ServiceT | null> => {
	const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));

	if (!row) {
		return null;
	}

	return {
		...row,
		logo_url: row.logo_url ? `https://s3.uha.app/logos/${row.slug}.webp` : ''
	};
};

const fetchFromRemote = async (params: RouteParams): Promise<ServiceT | null> => {
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
		ref_link: response.ref_link,
		domains: response.domains,
		social_links: response.social_links,
		aliases: response.alternative_names,
		category_slug: response.category_slug
	};
};

const parseFromSearch = (params: RouteParams): ServiceT => {
	const domains = parseDomains(params.service_domains);
	const bundle_id = params.service_bundle_id ?? domains[0] ?? '';

	return {
		...DEFAULT_SERVICE,
		id: params.service_id,
		logo_url: params.service_logo ?? '',
		slug: params.service_slug ?? domains[0]?.replace(/\./g, '-') ?? params.service_id,
		title: params.service_name,
		color: params.service_color ?? '',
		bundle_id,
		ref_link: params.service_ref_link ?? '',
		category_slug: params.service_category_slug ?? '',
		domains,
		aliases: parseStringArray(params.service_aliases),
		social_links: parseStringRecord(params.service_social_links)
	};
};

const resolveService = async (params: RouteParams): Promise<ServiceT> => {
	if (!REMOTE_SOURCES.has(params.service_source)) {
		return parseFromSearch(params);
	}

	const local = await fetchFromLocalDB(params.service_id);
	if (local) return local;

	if (REMOTE_SOURCES.has(params.service_source)) {
		try {
			const remote = await fetchFromRemote(params);
			if (remote) return remote;
		} catch {
			return parseFromSearch(params);
		}
	}

	return parseFromSearch(params);
};

const useLoadService = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState<ServiceT>();
	const params = useLocalSearchParams<RouteParams>();
	const {
		service_id,
		service_logo,
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
		if (!service_id) return;

		setIsLoading(true);

		resolveService({
			service_id,
			service_logo,
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
		})
			.then(setService)
			.catch(() => setService(createDefaultService()))
			.finally(() => setIsLoading(false));
	}, [
		service_id,
		service_logo,
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

	return { service, isLoading };
};

export default useLoadService;
