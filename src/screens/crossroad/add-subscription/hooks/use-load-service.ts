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
	service_category_slug?: SearchResultT['category_slug'];
	service_domains?: string; // expo-router converts string[] to string
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
const REMOTE_SOURCES = new Set(['inhouse', 'appstore', 'playstore', 'web']);

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
				source_hint: params.service_source,
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
		title: params.service_name,
		bundle_id,
		category_slug: params.service_category_slug ?? '',
		domains
	};
};

const resolveService = async (params: RouteParams): Promise<ServiceT> => {
	if (!REMOTE_SOURCES.has(params.service_source)) {
		return parseFromSearch(params);
	}

	const local = await fetchFromLocalDB(params.service_id);
	if (local) return local;

	const remote = await fetchFromRemote(params);
	if (remote) return remote;

	return createDefaultService();
};

const useLoadService = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [service, setService] = useState<ServiceT>();
	const params = useLocalSearchParams<RouteParams>();

	useEffect(() => {
		if (!params) return;

		resolveService(params)
			.then(setService)
			.catch(() => setService(createDefaultService()))
			.finally(() => setIsLoading(false));
	}, [params.service_id]);

	return { service, isLoading };
};

export default useLoadService;
