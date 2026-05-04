import { router } from 'expo-router';

type DetailTypeT = 'service' | 'subscription' | 'category' | 'payment';

export const openLibraryDetails = (type: DetailTypeT, id: string, title: string) => {
	router.push({
		pathname: '/(tabs)/library/[id]',
		params: { id, type, title }
	});
};

export const normalizeOptional = (value: string) => {
	const trimmed = value.trim();
	return trimmed.length ? trimmed : null;
};

export const parsePositiveInt = (value: string, fallback: number) => {
	const next = Number.parseInt(value, 10);
	return Number.isFinite(next) && next > 0 ? next : fallback;
};
