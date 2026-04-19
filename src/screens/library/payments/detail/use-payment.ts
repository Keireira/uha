import { useState, useEffect } from 'react';
import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { and, eq, inArray, max } from 'drizzle-orm';
import { tendersTable, subscriptionsTable, servicesTable, categoriesTable, currenciesTable, timelineEventsTable } from '@db/schema';

/** Event types that carry a price — used to derive the subscription's current price. */
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

export const usePayment = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [payment, setPayment] = useState<Record<string, any> | undefined>();
	const [subscriptions, setSubscriptions] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const payments = await db.select().from(tendersTable).where(eq(tendersTable.id, id));

			if (cancelled) return;
			setPayment(first(payments));

			const subs = await db
				.select({
					id: subscriptionsTable.id,
					custom_name: subscriptionsTable.custom_name,
					current_price: timelineEventsTable.amount,
					billing_cycle_type: subscriptionsTable.billing_cycle_type,
					billing_cycle_value: subscriptionsTable.billing_cycle_value,
					service_title: servicesTable.title,
					service_slug: servicesTable.slug,
					service_color: servicesTable.color,
					category_emoji: categoriesTable.emoji,
					category_title: categoriesTable.title,
					currency_code: currenciesTable.id,
					denominator: currenciesTable.denominator,
					fraction_digits: currenciesTable.fraction_digits,
					intl_locale: currenciesTable.intl_locale
				})
				.from(subscriptionsTable)
				.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
				.innerJoin(categoriesTable, eq(subscriptionsTable.category_slug, categoriesTable.slug))
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
				.where(eq(subscriptionsTable.tender_id, id));

			if (cancelled) return;
			setSubscriptions(subs);
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

	return { payment, subscriptions };
};
