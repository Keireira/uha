import { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { startOfMonth, startOfToday } from 'date-fns';
import { timeModeClause, globalFiltersClause } from './utils';

import db from '@db';
import { useAppModel } from '@models';
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
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: minDbTxsDate } = useLiveQuery(
		db
			.select({ minDate: min(transactionsTable.date) })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(globalFiltersClause(withFilters, lensesStore.filters), timeModeClause(timeMode))),
		[lensesStore.filters, timeMode]
	);

	const minDbTxsDateResult = useMemo(() => {
		const dateTxt = minDbTxsDate?.[0]?.minDate;

		return dateTxt ? startOfMonth(dateTxt) : undefined;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [minDbTxsDate, timeMode]);

	return minDbTxsDateResult || startOfToday();
};

export const useGetMaxMonthDate = (timeMode: TimeModesT, withFilters: boolean = true) => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: maxDbTxsDate } = useLiveQuery(
		db
			.select({ maxDate: max(transactionsTable.date) })
			.from(transactionsTable)
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(globalFiltersClause(withFilters, lensesStore.filters), timeModeClause(timeMode))),
		[lensesStore.filters, timeMode]
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
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const timeMode = useMemo(() => {
		return forcedTimeMode || lensesStore.time_mode;
	}, [forcedTimeMode, lensesStore.time_mode]);

	const minMonthDate = useGetMinMonthDate(timeMode, withFilters);
	const maxMonthDate = useGetMaxMonthDate(timeMode, withFilters);

	return [minMonthDate, maxMonthDate];
};

export default useTxDatesRange;
