// ilyaagarkov
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createStore, is } from 'effector';
import type { Store } from 'effector';

export type Callback = ((...args: any[]) => unknown) | undefined;

export type PickStores<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends Store<infer U> ? Store<U> : never;
};

export type ToFactoryParams<T> = {
	[K in keyof T]: T[K] extends Callback ? T[K] : T[K] extends Store<any> ? T[K] : Store<T[K]>;
};

export function toStore<T>(value: T | Store<T>): Store<T> {
	if (is.store(value)) {
		return value;
	}
	return createStore(value as T);
}
