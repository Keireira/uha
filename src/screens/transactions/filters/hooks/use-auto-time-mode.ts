import { useEffect } from 'react';
import { startOfToday, lightFormat } from 'date-fns';

import { useLensesStore } from '@screens/transactions/models';

import {
	tendersTable,
	servicesTable,
	currenciesTable,
	categoriesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import db from '@db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, gte, count, eq, isNull } from 'drizzle-orm';
import { buildWhereConditions } from '@hooks/use-transactions';

/**
 * When filters are active and time_mode is 'future', check if there
 * are zero upcoming transactions but some past ones. If so, auto-switch
 * to 'all' mode so the user can see results.
 */
const useAutoTimeMode = () => {
	const timeMode = useLensesStore((s) => s.time_mode);
	const filters = useLensesStore((s) => s.filters);
	const setTimeMode = useLensesStore((s) => s.setTimeMode);

	const hasFilters = filters.length > 0;
	const today = lightFormat(startOfToday(), 'yyyy-MM-dd');

	const {
		data: [futureCount]
	} = useLiveQuery(
		db
			.select({ value: count() })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(
				and(
					buildWhereConditions(filters),
					gte(transactionsTable.date, today),
					isNull(subscriptionsTable.cancellation_date)
				)
			),
		[filters]
	);

	const {
		data: [allTimeCount]
	} = useLiveQuery(
		db
			.select({ value: count() })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(buildWhereConditions(filters), isNull(subscriptionsTable.cancellation_date))),
		[filters]
	);

	useEffect(() => {
		if (!futureCount || !allTimeCount) {
			return;
		}

		if (futureCount.value === 0 && allTimeCount.value > 0 && timeMode === 'future' && hasFilters) {
			setTimeMode('all');
		} else if (futureCount.value > 0 && timeMode === 'all' && hasFilters) {
			setTimeMode('future');
		}

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [futureCount?.value, allTimeCount?.value, hasFilters, timeMode]);
};

export default useAutoTimeMode;
