import { createEvent } from 'effector';

const createViewModeModel = () => {
	const scrollToTop = createEvent();

	return {
		list: {
			scrollToTop
		}
	};
};

export default createViewModeModel;
