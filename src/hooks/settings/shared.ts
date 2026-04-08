import type { UserT } from '@models';
export type UserKey = keyof Omit<UserT, 'id'>;

export const USER_ID = '00000000-0000-0000-0000-000000000000';

const BOOLEAN_KEYS = new Set<UserKey>(['oled_mode', 'ai_enabled', 'is_unlimited']);
const JSON_KEYS = new Set<UserKey>(['search_sources']);

export const serializeForDb = (key: UserKey, value: any) => {
	if (JSON_KEYS.has(key)) return JSON.stringify(value);
	return value;
};

export const serializeForNS = (key: UserKey, value: any) => {
	if (BOOLEAN_KEYS.has(key)) return value ? 1 : 0;
	if (JSON_KEYS.has(key)) return JSON.stringify(value);
	return value;
};

export const deserialize = (key: UserKey, raw: any): any => {
	if (raw == null) return raw;
	if (BOOLEAN_KEYS.has(key)) return raw === 1 || raw === true;
	if (JSON_KEYS.has(key) && typeof raw === 'string') {
		try {
			return JSON.parse(raw);
		} catch {
			return raw;
		}
	}
	return raw;
};
