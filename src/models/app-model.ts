import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { createDirectionModel, createLensesModel, createViewableDateModel } from './shared';

const createAppModel = () => {
	const gate = createGate();

	return {
		gate,
		lenses: createLensesModel(),
		scroll: createDirectionModel(),
		viewableDate: createViewableDateModel()
	};
};

const appModel = createFactory(() => {
	return createAppModel();
});

export default appModel;
