import { createEvent, createStore, sample } from 'effector';
import { startOfMonth, endOfMonth, startOfToday } from 'date-fns';

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

	const $maxActiveDate = createStore<Date>(endOfMonth(new Date()));
	const setMaxActiveDate = createEvent<Date>();

	sample({
		clock: setMaxActiveDate,
		target: $maxActiveDate
	});

	const $minActiveDate = createStore<Date>(startOfMonth(new Date()));
	const setMinActiveDate = createEvent<Date>();

	sample({
		clock: setMinActiveDate,
		target: $minActiveDate
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
		},
		/* Limits of month generation in calendar view (look at useTransactions hook, this is where it sets) */
		maxActiveDate: {
			$value: $maxActiveDate,
			set: setMaxActiveDate
		},
		minActiveDate: {
			$value: $minActiveDate,
			set: setMinActiveDate
		}
	};
};

export default createTxDatesModel;
