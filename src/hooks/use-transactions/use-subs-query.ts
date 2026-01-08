import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getTableColumns, and, eq, max } from 'drizzle-orm';

import {
	currenciesTable,
	servicesTable,
	tendersTable,
	categoriesTable,
	subscriptionsTable,
	transactionsTable
} from '@db/schema';
import { db } from '@src/sql-migrations';

import type { PreparedSubscriptionT } from './types.d';

/* Get all subscriptions with their latest transaction date and keys for filtering */
const useSubscriptionsQuery = () => {
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
			.groupBy(subscriptionsTable.id)
	);

	return subscriptions satisfies PreparedSubscriptionT[];
};

export default useSubscriptionsQuery;
