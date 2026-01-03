import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { createDirectionModel, createLensesModel } from './all';

const createAppModel = () => {
	const gate = createGate();

	return {
		gate,
		lenses: createLensesModel(),
		scroll: createDirectionModel()
	};
};

const appModel = createFactory(() => {
	return createAppModel();
});

export default appModel;
