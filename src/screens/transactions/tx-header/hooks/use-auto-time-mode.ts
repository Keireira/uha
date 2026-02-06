import { useEffect, useRef } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { startOfToday } from 'date-fns';
import { and, gte, count } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

import db from '@db';
import {
	transactionsTable,
	subscriptionsTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	tendersTable
} from '@db/schema';
import { buildWhereConditions } from '@hooks/use-transactions/db-queries/utils';

import type { AppliedFilterT } from '@screens/transactions/models/types.d';
import type { TimeModesT } from '@screens/transactions/models/types.d';

/**
 * When filters are active and time_mode is 'future', check if there
 * are zero upcoming transactions but some past ones. If so, auto-switch
 * to 'all' mode so the user sees results.
 */
const useAutoTimeMode = (
	filters: AppliedFilterT[],
	timeMode: TimeModesT,
	setTimeMode: (mode: TimeModesT) => void
) => {
	const hasFilters = filters.length > 0;
	const today = startOfToday();

	// Count future transactions matching current filters
	const { data: futureCount } = useLiveQuery(
		db
			.select({ value: count() })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(buildWhereConditions(filters), gte(transactionsTable.date, today.toISOString()))),
		[filters]
	);

	// Count all-time transactions matching current filters
	const { data: allTimeCount } = useLiveQuery(
		db
			.select({ value: count() })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(buildWhereConditions(filters)),
		[filters]
	);

	const hasSwitched = useRef(false);

	useEffect(() => {
		if (!hasFilters || timeMode !== 'future') {
			hasSwitched.current = false;
			return;
		}

		const future = futureCount?.[0]?.value ?? 0;
		const allTime = allTimeCount?.[0]?.value ?? 0;

		if (future === 0 && allTime > 0 && !hasSwitched.current) {
			hasSwitched.current = true;
			setTimeMode('all');
		}
	}, [hasFilters, timeMode, futureCount, allTimeCount, setTimeMode]);
};

export default useAutoTimeMode;
