/* eslint-disable @typescript-eslint/no-explicit-any */
// ilyaagarkov

import { clearNode, createNode, is, withRegion } from 'effector';
import { createGate, Gate, useGate } from 'effector-react';
import { spread } from 'patronum';
import { createContext, useContext, useEffect, useRef } from 'react';
import { parseParams } from './parse-params';

import type { Callback } from './utils';
import type { Node, Store } from 'effector';
import type { Context, Provider } from 'react';

export type FactoryParams = Record<string, Store<any> | Callback>;

export type FromFactoryParams<T> = {
	[K in keyof T]: T[K] extends Store<infer U> ? U | Store<U> : T[K];
};

export function createFactory<T>(factory: () => T): Factory<T>;
export function createFactory<T, P extends FactoryParams>(factory: (params: P) => T): FactoryWithParams<T, P>;

export function createFactory(factory: any): any {
	const result = (params: any) => factory(params);

	result.create = (params: any) => {
		const paramsGate = createGate();
		let factoryResult;

		if (params) {
			const storifyParams = parseParams(params);
			factoryResult = factory(storifyParams.initialParams);
			spread({
				source: paramsGate.state,
				targets: storifyParams.gateParams
			});
		} else {
			factoryResult = factory();
		}

		return {
			result: factoryResult,
			paramsGate
		};
	};

	const context = createContext<any>({});

	result.Provider = context.Provider;
	result.context = context;
	(result as any)[withParamsSymbol] = factory.length > 0;

	return result;
}

export type Key = (string | number | symbol | null | undefined)[];

export type FactoryOptions = {
	key: Key;
};

export const withParamsSymbol = Symbol('withParams');

export type FactoryWithParams<T, P extends FactoryParams> = {
	(params: P): T;
	create(params: FromFactoryParams<P>): {
		result: T;
		paramsGate: Gate<FromFactoryParams<P>>;
	};
	Provider: Provider<T>;
	context: Context<T>;
	[withParamsSymbol]: true;
};

export type Factory<T> = {
	(): T;
	create(): {
		result: T;
	};
	Provider: Provider<T>;
	context: Context<T>;
	[withParamsSymbol]: false;
};

export function removeStores(params: Record<string, unknown> = {}) {
	return Object.keys(params).reduce((acc, key) => {
		if (is.store(params[key])) {
			return acc;
		}
		// @ts-ignore
		acc[key] = params[key];
		return acc;
	}, {});
}

type Params<T> = FromFactoryParams<T>;

export function useFactory<T>(factory: Factory<T>, options?: FactoryOptions): T;
export function useFactory<T, P extends FactoryParams>(
	factory: FactoryWithParams<T, P>,
	params: Params<P>,
	options?: FactoryOptions
): T;
export function useFactory(factory: any, params?: any, options?: any) {
	let _params: any, _options: any;
	if (factory[withParamsSymbol]) {
		[_params, _options] = [params, options];
	} else {
		_options = params;
	}

	const modelRef = useRef(null);
	const region = useRef<Node | null>(null);
	const keyRef = useRef(null);

	function clear() {
		if (region.current) {
			clearNode(region.current, { deep: true });
			region.current = null;
			modelRef.current = null;
		}
	}

	function create() {
		region.current = createNode();
		keyRef.current = _options?.key;
		withRegion(region.current, () => {
			modelRef.current = factory.create(_params);
		});
	}

	if (!modelRef.current) {
		create();
	}
	if (_options?.key !== keyRef.current) {
		clear();
		create();
	}

	// @ts-ignore
	useGate(modelRef.current.paramsGate, removeStores(_params));

	useEffect(() => {
		return () => {
			clear();
		};
	}, []);

	// @ts-ignore
	return modelRef.current.result;
}

export function useFactoryModel<T>(factory: Factory<T> | FactoryWithParams<T, any>): T {
	return useContext(factory.context);
}
