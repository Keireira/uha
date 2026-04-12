import { useLensesStore } from '@screens/transactions/models';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getTableColumns, and, eq, max } from 'drizzle-orm';

import {
	tendersTable,
	servicesTable,
	currenciesTable,
	categoriesTable,
	transactionsTable,
	subscriptionsTable,
	priceHistoryTable
} from '@db/schema';
import db from '@db';
import { buildWhereConditions } from './utils';

import type { PreparedSubscriptionT } from '../types.d';

/* Subquery: latest price_history date per subscription */
const latestPriceDate = db
	.select({
		subscription_id: priceHistoryTable.subscription_id,
		max_date: max(priceHistoryTable.date).as('max_date')
	})
	.from(priceHistoryTable)
	.groupBy(priceHistoryTable.subscription_id)
	.as('lpd');

/* Get all subscriptions with their latest transaction date and keys for filtering */
const useSubscriptionsQuery = () => {
	const filters = useLensesStore((sub) => sub.filters);

	const { data: subscriptions } = useLiveQuery(
		db
			.select({
				...getTableColumns(subscriptionsTable),
				/* Find a latest transaction in aggregation (thx, groupBy), so we don't have to calc it manually */
				latest_transaction_date: max(transactionsTable.date),

				/* Current price from latest price_history entry, converted to minor units */
				current_price: priceHistoryTable.amount,
				current_currency_id: priceHistoryTable.currency_id,

				/* Joined fields, so we can filter data later, AND include them in PreparedDbTxT-like object,
				 * since we don't have access to tables' joins in that live-generation
				 */
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				slug: servicesTable.slug,
				title: servicesTable.title,
				emoji: categoriesTable.emoji,
				color: servicesTable.color,

				/* category-related fields. category_slug is already included in the `getTableColumns()` call */
				category_title: categoriesTable.title,
				category_color: categoriesTable.color
			})
			.from(subscriptionsTable)
			.leftJoin(latestPriceDate, eq(subscriptionsTable.id, latestPriceDate.subscription_id))
			.leftJoin(
				priceHistoryTable,
				and(
					eq(priceHistoryTable.subscription_id, subscriptionsTable.id),
					eq(priceHistoryTable.date, latestPriceDate.max_date)
				)
			)
			.leftJoin(currenciesTable, eq(priceHistoryTable.currency_id, currenciesTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.leftJoin(tendersTable, eq(subscriptionsTable.tender_id, tendersTable.id))
			.innerJoin(transactionsTable, and(eq(subscriptionsTable.id, transactionsTable.subscription_id)))
			.where(buildWhereConditions(filters))
			.groupBy(subscriptionsTable.id),
		[filters]
	);

	return subscriptions satisfies PreparedSubscriptionT[];
};

export default useSubscriptionsQuery;
