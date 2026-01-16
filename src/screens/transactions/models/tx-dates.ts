import { createEvent, createStore, sample } from 'effector';
import { startOfMonth, startOfToday } from 'date-fns';

const createTxDatesModel = () => {
	const $focusedDate = createStore<Date>(startOfToday());
	const setFocusedDate = createEvent<Date>();

	sample({
		clock: setFocusedDate,
		target: $focusedDate
	});

	const $selectedDate = createStore<Date>(startOfToday());
	const setSelectedDate = createEvent<Date>();

	sample({
		clock: setSelectedDate,
		target: $selectedDate
	});

	const $activeMonth = createStore<Date>(startOfMonth(new Date()));
	const setActiveMonth = createEvent<Date>();

	sample({
		clock: setActiveMonth,
		target: $activeMonth
	});

	return {
		/* currently shown month in the list view */
		focused: {
			$value: $focusedDate,
			set: setFocusedDate
		},
		/* The date we select in calendar view to show list of txs */
		selected: {
			$value: $selectedDate,
			set: setSelectedDate
		},
		/* Calendar month that is shown (as primary calendar) in the calendar view */
		activeMonth: {
			$value: $activeMonth,
			set: setActiveMonth
		}
	};
};

export default createTxDatesModel;
