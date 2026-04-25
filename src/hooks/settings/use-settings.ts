import { Settings } from 'react-native';
import { useSyncExternalStore } from 'react';

import { silentDb } from '@db';
import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';

import { USER_ID } from '@db/constants';
import { serializeForDb, serializeForNS } from './shared';

import type { UserKey } from './shared';
type Listener = () => void;

const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

export const cache = new Map<UserKey, any>();

export const getSettingsValue = <T>(key: UserKey): T => {
	return cache.get(key) as T;
};

export const setSettingsValue = <T>(key: UserKey, value: T) => {
	cache.set(key, value);
	Settings.set({ [key]: serializeForNS(key, value) });
	notify();

	silentDb
		.update(userTable)
		.set({ [key]: serializeForDb(key, value) })
		.where(eq(userTable.id, USER_ID))
		.execute()
		.catch((e) => console.warn('[settings] DB write failed:', key, e));
};

export const useSettingsValue = <T>(key: UserKey): T => {
	const externalStore = useSyncExternalStore(
		(cb) => {
			listeners.add(cb);

			return () => listeners.delete(cb);
		},
		() => cache.get(key) as T
	);

	return externalStore;
};
