// ilyaagarkov

import React from 'react';
import { useFactory, withParamsSymbol } from './use-factory';

import type { Factory, FactoryParams, FactoryWithParams, FromFactoryParams, Key } from './use-factory';

export function withFactory<Model, Props>(params: {
	Component: React.ComponentType<Props>;
	factory: Factory<Model>;
	key?: (props: Props) => Key;
	withoutRemount?: boolean;
}): React.ComponentType<Props>;

export function withFactory<Model, Props, Params extends FactoryParams>(params: {
	factory: FactoryWithParams<Model, Params>;
	params: (props: Props) => FromFactoryParams<Params>;
	Component: React.ComponentType<Props>;
	key?: (props: Props) => Key;
	withoutRemount?: boolean;
}): React.ComponentType<Props>;

export function withFactory<Model, Props extends React.JSX.IntrinsicAttributes, Params extends FactoryParams>({
	factory,
	params,
	Component,
	key,
	withoutRemount = false
}: {
	factory: Factory<Model> | FactoryWithParams<Model, Params>;
	params?: (props: Props) => Params;
	Component: React.ComponentType<Props>;
	key?: (props: Props) => Key;
	withoutRemount?: boolean;
}) {
	function getKey(props: Props) {
		return key ? key(props).join('.') : undefined;
	}

	function Wrapper(props: Props) {
		const key = getKey(props);
		const useFactoryParams = factory[withParamsSymbol]
			? [factory, params!(props) ?? undefined, { key }]
			: [factory, { key }];

		// @ts-expect-error
		const model = useFactory(...useFactoryParams);
		return (
			<factory.Provider value={model}>
				<Component {...props} />
			</factory.Provider>
		);
	}

	return function WithFactory(props: Props) {
		const componentKey = withoutRemount ? 'static' : getKey(props);
		return <Wrapper key={componentKey} {...props} />;
	};
}
