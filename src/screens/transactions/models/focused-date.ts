import { createEvent, createStore, sample } from 'effector';

/*
 * EXPLANATION:
 *
 * When we scroll over txs-list, we need to know what month is currently viewed,
 * so we can recalc summaries for the current month
 */
const createFocusedDateModel = () => {
	const $focusedDate = createStore<Date | null>(null);
	const setFocusedDate = createEvent<Date>();

	sample({
		clock: setFocusedDate,
		target: $focusedDate
	});

	return {
		$date: $focusedDate,
		set: setFocusedDate
	};
};

export default createFocusedDateModel;
