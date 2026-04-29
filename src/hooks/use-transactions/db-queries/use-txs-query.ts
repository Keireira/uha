import { useMemo } from 'react';
import { eq, asc, and } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	tendersTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import db from '@db';
import { useLensesStore } from '@screens/transactions/models';
import { timeModeClause, globalFiltersClause } from './utils';

import type { SQL } from 'drizzle-orm';
import type { PreparedDbTxT } from '../types.d';
import type { TimeModesT } from '@screens/transactions/models/types.d';

type UseTransactionsQueryParams = {
	withFilters: boolean;
	forcedTimeMode?: TimeModesT;
	customWhere?: SQL;
};

const useTransactionsQuery = ({ forcedTimeMode, withFilters, customWhere }: UseTransactionsQueryParams) => {
	const time_mode = useLensesStore((s) => s.time_mode);
	const filters = useLensesStore((s) => s.filters);

	const timeMode = useMemo(() => {
		return forcedTimeMode || time_mode;
	}, [forcedTimeMode, time_mode]);

	const { data: dbTxs } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				subscription_id: transactionsTable.subscription_id,
				service_id: subscriptionsTable.service_id,
				currency: currenciesTable.symbol,
				currency_code: currenciesTable.id,
				denominator: currenciesTable.denominator,
				price: transactionsTable.amount,
				slug: servicesTable.slug,
				logo_url: servicesTable.logo_url,
				title: servicesTable.title,
				customName: subscriptionsTable.custom_name,
				custom_logo: subscriptionsTable.custom_logo,
				custom_symbol: subscriptionsTable.custom_symbol,
				emoji: categoriesTable.emoji,
				color: servicesTable.color,
				date: transactionsTable.date,
				comment: transactionsTable.comment,

				/* category-related fields */
				category_slug: categoriesTable.slug,
				category_title: categoriesTable.title,
				category_color: categoriesTable.color,

				/* tender-related fields */
				tender_id: tendersTable.id,
				tender_emoji: tendersTable.emoji,
				tender_title: tendersTable.title,
				tender_comment: tendersTable.comment
			})
			.from(transactionsTable)
			/**
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
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.orderBy(asc(transactionsTable.date))
			.where(and(globalFiltersClause(withFilters, filters), timeModeClause(timeMode), customWhere)),
		[filters, timeMode]
	);

	return dbTxs satisfies PreparedDbTxT[];
};

export default useTransactionsQuery;
