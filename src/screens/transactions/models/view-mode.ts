import { createEvent, createStore, sample } from 'effector';

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
