import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';
import { createEvent, createStore, sample } from 'effector';

type AppModelProps = {};

type ScrollDirection = 'up' | 'down' | 'idle';

const createAppModel = ({}: AppModelProps) => {
	const gate = createGate();
	const $direction = createStore<ScrollDirection>('idle');
	const setScrollDirection = createEvent<ScrollDirection>();

	sample({
		clock: setScrollDirection,
		target: $direction
	});

	return {
		gate,
		scroll: {
			$direction,
			setDirection: setScrollDirection
		}
	};
};

const appModel = createFactory(() => {
	return createAppModel({});
});

export default appModel;
