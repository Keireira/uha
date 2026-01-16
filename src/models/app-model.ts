import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { createDirectionModel } from './shared';
import { createFocusedDateModel, createLensesModel, createViewModeModel } from '@screens/transactions/models';

const createAppModel = () => {
	const gate = createGate();

	return {
		gate,
		/* navigation-related models */
		scroll: createDirectionModel(),

		/* tx-related models */
		lenses: createLensesModel(),
		viewMode: createViewModeModel(),
		focusedDate: createFocusedDateModel()
	};
};

const appModel = createFactory(() => {
	return createAppModel();
});

export default appModel;
