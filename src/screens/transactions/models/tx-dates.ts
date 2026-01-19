import { createEvent, createStore, sample } from 'effector';
import { startOfMonth, endOfMonth, startOfToday, addMonths, isAfter, isBefore } from 'date-fns';

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

	const $isTerminationView = createStore<boolean>(false);

	sample({
		clock: [$activeMonth, $minActiveDate, $maxActiveDate],
		source: {
			activeMonth: $activeMonth,
			minActiveDate: $minActiveDate,
			maxActiveDate: $maxActiveDate
		},
		fn: ({ activeMonth, minActiveDate, maxActiveDate }) => {
			const nextMaxMonth = addMonths(activeMonth, 1);

			return isBefore(activeMonth, minActiveDate) || isAfter(nextMaxMonth, maxActiveDate);
		},
		target: $isTerminationView
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
		/* To check whether or not we on the termination views of calendar */
		is_termination_view: {
			$value: $isTerminationView
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
