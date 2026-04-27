import { useLensesStore } from '@screens/transactions/models';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getTableColumns, and, eq, inArray, max } from 'drizzle-orm';

import {
	tendersTable,
	servicesTable,
	currenciesTable,
	categoriesTable,
	transactionsTable,
	subscriptionsTable,
	timelineEventsTable
} from '@db/schema';
import db from '@db';
import { buildWhereConditions } from './utils';

import type { PreparedSubscriptionT } from '../types.d';

/** Event types that carry a price, used to derive the subscription's current price. */
const PRICED_EVENT_TYPES = ['first_payment', 'price_up', 'price_down'] as const;

/* Subquery: latest priced-event date per subscription (first_payment, price_up, price_down) */
const latestPriceDate = db
	.select({
		subscription_id: timelineEventsTable.subscription_id,
		max_date: max(timelineEventsTable.date).as('max_date')
	})
	.from(timelineEventsTable)
	.where(inArray(timelineEventsTable.type, PRICED_EVENT_TYPES))
	.groupBy(timelineEventsTable.subscription_id)
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

				/* Current price resolved from the latest priced timeline event */
				current_price: timelineEventsTable.amount,
				current_currency_id: timelineEventsTable.currency_id,

				/* Joined fields, so we can filter data later, AND include them in PreparedDbTxT-like object,
				 * since we don't have access to tables' joins in that live-generation
				 */
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				slug: servicesTable.slug,
				logo_url: servicesTable.logo_url,
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
				timelineEventsTable,
				and(
					eq(timelineEventsTable.subscription_id, subscriptionsTable.id),
					eq(timelineEventsTable.date, latestPriceDate.max_date),
					inArray(timelineEventsTable.type, PRICED_EVENT_TYPES)
				)
			)
			.leftJoin(currenciesTable, eq(timelineEventsTable.currency_id, currenciesTable.id))
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
