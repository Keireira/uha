import * as Crypto from 'expo-crypto';

import type { SearchResultT } from '../soup.d';
import type { ITunesApp, ITunesSearchResponse } from './appstore.d';

const GENRE_TO_CATEGORY: Record<string, string> = {
	'6000': 'productivity',
	'6001': 'utilities_and_bills',
	'6002': 'utilities_and_bills',
	'6003': 'travel_and_flights',
	'6004': 'health_and_fitness',
	'6005': 'social',
	'6006': 'education',
	'6007': 'productivity',
	'6008': 'design_and_creative',
	'6009': 'news_and_reading',
	'6010': 'transportation',
	'6011': 'music_and_audiobooks',
	'6012': 'beauty_care',
	'6013': 'health_and_fitness',
	'6014': 'gaming',
	'6015': 'finances_and_insurance',
	'6016': 'video_streaming',
	'6017': 'education',
	'6018': 'news_and_reading',
	'6020': 'health_and_fitness',
	'6023': 'food_and_delivery',
	'6024': 'shopping_and_memberships',
	'6026': 'developer_tools',
	'6027': 'design_and_creative'
};

const mapGenres = (genreIds?: string[]) => {
	if (!Array.isArray(genreIds)) return;

	return genreIds.find((g) => g in GENRE_TO_CATEGORY);
};

const extractDomain = (url?: string) => {
	if (!url) return;

	try {
		return new URL(url).hostname;
	} catch {
		return undefined;
	}
};

const toSearchResult = (app: ITunesApp): SearchResultT => {
	const domains: string[] = [];
	const sellerDomain = extractDomain(app.sellerUrl);

	if (sellerDomain) {
		domains.push(sellerDomain);
	}

	domains.push(app.bundleId);

	return {
		id: Crypto.randomUUID(),
		logo_url: app.artworkUrl512 ?? app.artworkUrl100 ?? '',
		name: app.trackName,
		domains,
		source: 'appstore',
		bundle_id: app.bundleId,
		category_slug: mapGenres(app.genreIds)
	};
};

export const searchAppStore = async (query: string, country: string = 'US'): Promise<SearchResultT[]> => {
	const url = `https://itunes.apple.com/${country.toLowerCase()}/search?${new URLSearchParams({
		term: query,
		entity: 'software',
		limit: '10'
	})}`;

	try {
		const resp = await fetch(url);
		if (!resp.ok) return [];

		const data: ITunesSearchResponse = await resp.json();

		const result = data.results.reduce((acc, item) => {
			if (!item.bundleId) return acc;

			return [...acc, toSearchResult(item)];
		}, [] as SearchResultT[]);

		return result;
	} catch {
		return [];
	}
};
