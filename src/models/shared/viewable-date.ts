import { createEvent, createStore, sample } from 'effector';

const createViewableDateModel = () => {
	const $viewableDate = createStore<Date | null>(null);
	const setViewableDate = createEvent<Date>();

	sample({
		clock: setViewableDate,
		target: $viewableDate
	});

	return {
		$date: $viewableDate,
		set: setViewableDate
	};
};

export default createViewableDateModel;
