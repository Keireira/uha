import { useMemo } from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { startOfMonth, startOfYear } from 'date-fns';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	tendersTable,
	servicesTable,
	currenciesTable,
	categoriesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import { eq, and } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { buildWhereConditions, buildForSummaries } from '@screens/subs-list/utils';

const useTransactionsQuery = () => {
	const { lenses, scroll } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const viewableDate = useUnit(scroll.$viewableDate);

	/*
	 * We can't use plain `viewableDate` in `useLiveQuery`,
	 * since I don't want to run query for every possible day in the feed
	 */
	const { viewableMonthDate, viewableYearDate } = useMemo(() => {
		const date = viewableDate || new Date();

		return {
			viewableMonthDate: startOfMonth(date),
			viewableYearDate: startOfYear(date)
		};
	}, [viewableDate]);

	// @TODO: add support of RECALC currency
	const { data: transactionsMonth } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				amount: transactionsTable.amount,
				category_id: categoriesTable.id,
				category_color: categoriesTable.color,
				denominator: currenciesTable.denominator
			})
			.from(transactionsTable)
			/* We need to have a lot of joins here for filtering reasons (in transactions list) */
			.leftJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(buildWhereConditions(lensesStore.filters), buildForSummaries('month', viewableMonthDate))),
		[lensesStore.filters, viewableMonthDate]
	);

	// @TODO: add support of RECALC currency
	const { data: transactionsYear } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				amount: transactionsTable.amount,
				category_id: categoriesTable.id,
				category_color: categoriesTable.color,
				denominator: currenciesTable.denominator
			})
			.from(transactionsTable)
			/* We need to have a lot of joins here for filtering reasons (in transactions list) */
			.leftJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(and(buildWhereConditions(lensesStore.filters), buildForSummaries('year', viewableYearDate))),
		[lensesStore.filters, viewableYearDate]
	);

	return {
		year: transactionsYear,
		month: transactionsMonth,
		dates: {
			month: viewableMonthDate,
			year: viewableYearDate
		}
	};
};

export type TransactionsQueryReturnT = ReturnType<typeof useTransactionsQuery>;

export default useTransactionsQuery;
