import { asc } from 'drizzle-orm';
import { createEffect, createEvent, createStore, sample } from 'effector';

import { servicesTable } from '@db/schema';
import type { ServiceT, DBT } from '@models/app-model.d';

const createServicesModel = ({ db }: { db: DBT }) => {
	const $services = createStore<ServiceT[]>([]);
	const getServicesFx = createEffect(async () => {
		const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.title));

		return services;
	});
	const setServices = createEvent<ServiceT[]>();

	sample({
		clock: getServicesFx.doneData,
		target: $services
	});

	sample({
		clock: setServices,
		fn: (services) => {
			db.insert(servicesTable).values(services);

			return services;
		},
		target: $services
	});

	getServicesFx();

	return {
		$services,
		setServices
	};
};

export default createServicesModel;
