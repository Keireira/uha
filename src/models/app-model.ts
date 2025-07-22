import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { createDirectionModel } from './all';

const createAppModel = () => {
	const gate = createGate();

	return {
		gate,
		scroll: createDirectionModel()
	};
};

const appModel = createFactory(() => {
	return createAppModel();
});

export default appModel;
