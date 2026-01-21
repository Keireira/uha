import { createEvent, createStore, sample } from 'effector';

/*
 * EXPLANATION:
 *
 * We have multiple view modes for transactions screen
 * (maybe rename transactions view to just index view? or master? or whatever?)
 * - list (default)
 * - calendar
 * - subscriptions (though it's not fully related to transactions)
 *
 * And we have to manage it somehow, as well as save it locally in the app,
 * so we can restore it when the app is reopened.
 */
const createViewModeModel = () => {
	const scrollToTop = createEvent();

	const $calendarScale = createStore<'year' | 'month'>('month');
	const setCalendarScale = createEvent<'year' | 'month'>();
	sample({
		clock: setCalendarScale,
		target: $calendarScale
	});

	return {
		list: {
			scrollToTop
		},
		calendar: {
			$scale: $calendarScale,
			setScale: setCalendarScale
		}
	};
};

export default createViewModeModel;
