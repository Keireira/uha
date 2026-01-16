import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { createDirectionModel } from './shared';
import { createTxDatesModel, createLensesModel, createViewModeModel } from '@screens/transactions/models';

const createAppModel = () => {
	const gate = createGate();

	return {
		gate,
		/* navigation-related models */
		scroll: createDirectionModel(),

		/* tx-related models */
		lenses: createLensesModel(),
		tx_dates: createTxDatesModel(),
		view_mode: createViewModeModel()
	};
};

const appModel = createFactory(() => {
	return createAppModel();
});

export default appModel;
