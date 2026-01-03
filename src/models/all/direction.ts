import { createEvent, createStore, sample } from 'effector';

import type { ScrollDirection } from '@models/app-model.d';

const createDirectionModel = () => {
	const $direction = createStore<ScrollDirection>('idle');
	const setScrollDirection = createEvent<ScrollDirection>();

	sample({
		clock: setScrollDirection,
		target: $direction
	});

	const $viewableDate = createStore<Date | null>(null);
	const setViewableDate = createEvent<Date>();

	sample({
		clock: setViewableDate,
		target: $viewableDate
	});

	return {
		$direction,
		setDirection: setScrollDirection,

		$viewableDate,
		setViewableDate: setViewableDate
	};
};

export default createDirectionModel;
