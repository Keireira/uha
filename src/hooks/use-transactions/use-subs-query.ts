import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getTableColumns, inArray, and, eq, max } from 'drizzle-orm';

import {
	currenciesTable,
	servicesTable,
	tendersTable,
	categoriesTable,
	subscriptionsTable,
	transactionsTable
} from '@db/schema';
import { db } from '@src/sql-migrations';

import type { SQL } from 'drizzle-orm';
import type { PreparedSubscriptionT } from './types.d';
import type { AppliedFilterT } from '@models/app-model.d';

/* Master Filters */
const filterTypeToIdColumn = {
	category: categoriesTable.id,
	service: servicesTable.id,
	currency: currenciesTable.id,
	tender: tendersTable.id
} as const;

export const buildWhereConditions = (filters: AppliedFilterT[]) => {
	const conditions: SQL[] = [];

	for (const type in filterTypeToIdColumn) {
		const ids = filters.reduce((acc, filter) => {
			if (filter.type === type) {
				acc.push(filter.value);
			}

			return acc;
		}, [] as string[]);

		if (ids.length > 0) {
			const id = filterTypeToIdColumn[type as keyof typeof filterTypeToIdColumn];

			conditions.push(inArray(id, ids));
		}
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
};

/* Get all subscriptions with their latest transaction date and keys for filtering */
const useSubscriptionsQuery = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: subscriptions } = useLiveQuery(
		db
			.select({
				/* do not forget: currency_id -> current_currency_id */
				...getTableColumns(subscriptionsTable),
				/* Find a latest transaction in aggregation (thx, groupBy), so we don't have to calc it manually */
				latest_transaction_date: max(transactionsTable.date),

				/* Joined fields, so we can filter data later, AND include them in PreparedDbTxT-like object,
				 * since we don't have access to tables' joins in that live-generation
				 */
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				slug: servicesTable.slug,
				title: servicesTable.title,
				emoji: categoriesTable.emoji,
				category: categoriesTable.title,
				color: servicesTable.color
			})
			.from(subscriptionsTable)
			.innerJoin(currenciesTable, eq(subscriptionsTable.current_currency_id, currenciesTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(subscriptionsTable.tender_id, tendersTable.id))
			.innerJoin(transactionsTable, and(eq(subscriptionsTable.id, transactionsTable.subscription_id)))
			.where(buildWhereConditions(lensesStore.filters))
			.groupBy(subscriptionsTable.id),
		[lensesStore.filters]
	);

	return subscriptions satisfies PreparedSubscriptionT[];
};

export default useSubscriptionsQuery;
