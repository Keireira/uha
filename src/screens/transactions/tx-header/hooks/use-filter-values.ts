import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { eq, isNull, inArray } from 'drizzle-orm';
import { categoriesTable, currenciesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

import type { ActiveEntryT } from '../tx-header.d';

const useFilterValues = () => {
	const { data: services } = useLiveQuery(
		db
			.selectDistinct({
				id: servicesTable.id,
				title: servicesTable.title
			})
			.from(servicesTable)
			.where(
				inArray(
					servicesTable.id,
					db
						.select({ id: subscriptionsTable.service_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: categories } = useLiveQuery(
		db
			.selectDistinct({
				id: categoriesTable.id,
				title: categoriesTable.title
			})
			.from(categoriesTable)
			.where(
				inArray(
					categoriesTable.id,
					db
						.select({ id: servicesTable.category_id })
						.from(servicesTable)
						.innerJoin(subscriptionsTable, eq(subscriptionsTable.service_id, servicesTable.id))
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: tenders } = useLiveQuery(
		db
			.selectDistinct({
				id: tendersTable.id,
				title: tendersTable.title
			})
			.from(tendersTable)
			.where(
				inArray(
					tendersTable.id,
					db
						.select({ id: subscriptionsTable.tender_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	const { data: currencies } = useLiveQuery(
		db
			.selectDistinct({
				id: currenciesTable.id,
				title: currenciesTable.id
			})
			.from(currenciesTable)
			.where(
				inArray(
					currenciesTable.id,
					db
						.select({ id: subscriptionsTable.current_currency_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	return {
		services: services satisfies ActiveEntryT[],
		categories: categories satisfies ActiveEntryT[],
		tenders: tenders satisfies ActiveEntryT[],
		currencies: currencies satisfies ActiveEntryT[]
	};
};

export default useFilterValues;
