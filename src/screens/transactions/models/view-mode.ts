import { createEvent, createStore, sample } from 'effector';

import type { ViewModeModel, ViewModeT } from './types.d';

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
	const $viewMode = createStore<ViewModeModel['view_mode']>('list');
	const setViewMode = createEvent<ViewModeT>();

	sample({
		clock: setViewMode,
		target: $viewMode
	});

	const scrollToTop = createEvent();

	const $calendarScale = createStore<'year' | 'month'>('month');
	const setCalendarScale = createEvent<'year' | 'month'>();
	sample({
		clock: setCalendarScale,
		target: $calendarScale
	});

	return {
		$mode: $viewMode,
		set: setViewMode,
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
