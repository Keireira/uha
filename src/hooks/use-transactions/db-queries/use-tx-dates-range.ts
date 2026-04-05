import { useMemo } from 'react';
import { startOfMonth, startOfToday } from 'date-fns';
import { timeModeClause, globalFiltersClause } from './utils';

import db from '@db';
import { useLensesStore } from '@screens/transactions/models';
import { and, min, max, eq } from 'drizzle-orm';
import {
	tendersTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { TimeModesT } from '@screens/transactions/models/types.d';

export const useGetMinMonthDate = (timeMode: TimeModesT, withFilters: boolean = true) => {
	const filters = useLensesStore((s) => s.filters);

	const { data: minDbTxsDate } = useLiveQuery(
		db
			.select({ minDate: min(transactionsTable.date) })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(globalFiltersClause(withFilters, filters), timeModeClause(timeMode))),
		[filters, timeMode]
	);

	const minDbTxsDateResult = useMemo(() => {
		const dateTxt = minDbTxsDate?.[0]?.minDate;

		return dateTxt ? startOfMonth(dateTxt) : undefined;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [minDbTxsDate, timeMode]);

	return minDbTxsDateResult || startOfToday();
};

export const useGetMaxMonthDate = (timeMode: TimeModesT, withFilters: boolean = true) => {
	const filters = useLensesStore((s) => s.filters);

	const { data: maxDbTxsDate } = useLiveQuery(
		db
			.select({ maxDate: max(transactionsTable.date) })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(globalFiltersClause(withFilters, filters), timeModeClause(timeMode))),
		[filters, timeMode]
	);

	const maxDbTxsDateResult = useMemo(() => {
		const dateTxt = maxDbTxsDate?.[0]?.maxDate;

		return dateTxt ? startOfMonth(dateTxt) : undefined;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [maxDbTxsDate, timeMode]);

	return maxDbTxsDateResult || startOfToday();
};

type MinDateT = ReturnType<typeof useGetMinMonthDate>;
type MaxDateT = ReturnType<typeof useGetMaxMonthDate>;

const useTxDatesRange = (forcedTimeMode: TimeModesT | undefined, withFilters: boolean = true): [MinDateT, MaxDateT] => {
	const time_mode = useLensesStore((s) => s.time_mode);

	const timeMode = useMemo(() => {
		return forcedTimeMode || time_mode;
	}, [forcedTimeMode, time_mode]);

	const minMonthDate = useGetMinMonthDate(timeMode, withFilters);
	const maxMonthDate = useGetMaxMonthDate(timeMode, withFilters);

	return [minMonthDate, maxMonthDate];
};

export default useTxDatesRange;
