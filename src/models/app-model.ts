import { createGate } from 'effector-react';
import { createFactory } from '@lib/effector';

import { db as drizzleDB } from '@src/sql-migrations';
import { createCategoriesModel, createDirectionModel, createPaymentsModel, createServicesModel } from './all';

import type { DBT } from './app-model.d';

type AppModelT = {
	db: DBT;
};

const createAppModel = ({ db }: AppModelT) => {
	const gate = createGate();

	return {
		gate,
		scroll: createDirectionModel(),
		services: createServicesModel({ db }),
		payments: createPaymentsModel({ db }),
		categories: createCategoriesModel({ db })
	};
};

const appModel = createFactory(() => {
	return createAppModel({ db: drizzleDB });
});

export default appModel;
