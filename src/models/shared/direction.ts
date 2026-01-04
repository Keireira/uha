import { createEvent, createStore, sample } from 'effector';

import type { ScrollDirection } from '@models/app-model.d';

const createDirectionModel = () => {
	const $direction = createStore<ScrollDirection>('idle');
	const setScrollDirection = createEvent<ScrollDirection>();

	sample({
		clock: setScrollDirection,
		target: $direction
	});

	return {
		$direction,
		setDirection: setScrollDirection
	};
};

export default createDirectionModel;
