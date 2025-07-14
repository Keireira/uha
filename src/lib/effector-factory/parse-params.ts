// ilyaagarkov
import { toStore } from './utils';

import type { Store } from 'effector';
import type { PickStores, ToFactoryParams } from './utils';

export function parseParams<T extends Record<string, unknown>>(
	params: T
): {
	gateParams: PickStores<ToFactoryParams<T>>;
	initialParams: ToFactoryParams<T>;
} {
	// @ts-ignore
	return Object.keys(params).reduce(
		(acc, key) => {
			if (typeof params[key] !== 'function') {
				const store = toStore(params[key]);
				// @ts-ignore
				acc.gateParams[key] = store as Store<unknown>;
				// @ts-ignore
				acc.initialParams[key] = store;
			} else {
				// @ts-ignore
				acc.initialParams[key] = params[key];
			}

			return acc;
		},
		{ gateParams: {}, initialParams: {} }
	);
}
