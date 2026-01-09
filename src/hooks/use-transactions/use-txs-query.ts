import { startOfToday } from 'date-fns';
import { useUnit } from 'effector-react';
import { eq, asc, gte, and } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	tendersTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { buildWhereConditions } from './use-subs-query';

import type { PreparedDbTxT } from './types.d';
import type { TimeModesT } from '@models/app-model.d';

const timeModeFilter = (timeMode: TimeModesT) => {
	if (timeMode === 'future') {
		const today = startOfToday();

		return gte(transactionsTable.date, today.toISOString());
	}

	return undefined;
};

/* Unfortunately, we can't fully rely on interactions with DB.
 * We have to add possible future transactions on the fly, or else DB will be stuck in infinite loop :(
 * (add phantom txs to the list -> db updates -> ...)
 *
 * But if I'll resolve this issue, I hope we will be able to use tables' query functionality on full;
 */
const useTransactionsQuery = (): PreparedDbTxT[] => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: dbTxs } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				price: transactionsTable.amount,
				slug: servicesTable.slug,
				title: servicesTable.title,
				customName: subscriptionsTable.custom_name,
				emoji: categoriesTable.emoji,
				category: categoriesTable.title,
				color: servicesTable.color,
				date: transactionsTable.date
			})
			.from(transactionsTable)
			/*
			 * !!! @NB for myself:
			 *
			 * `.innerJoin()` if we're sure we don't have null values
			 * `.leftJoin()` if possible value is null ("I might not find a matching row at all")
			 *
			 * For the state of "possible values" look at references fields in the schema
			 */
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.orderBy(asc(transactionsTable.date))
			.where(and(buildWhereConditions(lensesStore.filters), timeModeFilter(lensesStore.time_mode))),
		[lensesStore.time_mode]
	);

	return dbTxs satisfies PreparedDbTxT[];
};

export default useTransactionsQuery;
