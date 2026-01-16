import { useMemo } from 'react';
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
import { buildWhereConditions } from './utils';

import type { PreparedDbTxT } from '../types.d';
import type { TimeModesT } from '@screens/transactions/models/types.d';

const timeModeFilter = (timeMode: TimeModesT) => {
	if (timeMode === 'future') {
		const today = startOfToday();

		return gte(transactionsTable.date, today.toISOString());
	}

	return undefined;
};

const useTransactionsQuery = (forcedTimeMode?: TimeModesT): PreparedDbTxT[] => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const timeMode = useMemo(() => {
		return forcedTimeMode || lensesStore.time_mode;
	}, [forcedTimeMode, lensesStore.time_mode]);

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
				color: servicesTable.color,
				date: transactionsTable.date,

				/* category-related fields */
				category_id: categoriesTable.id,
				category_title: categoriesTable.title,
				category_color: categoriesTable.color
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
			.where(and(buildWhereConditions(lensesStore.filters), timeModeFilter(timeMode))),
		[lensesStore.filters, timeMode]
	);

	return dbTxs satisfies PreparedDbTxT[];
};

export default useTransactionsQuery;
