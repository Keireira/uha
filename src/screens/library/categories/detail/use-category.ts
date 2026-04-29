import { useState, useEffect } from 'react';
import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { and, eq, inArray, max } from 'drizzle-orm';
import { categoriesTable, subscriptionsTable, servicesTable, currenciesTable, timelineEventsTable } from '@db/schema';

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

type CategorySubscriptionT = Pick<
	typeof subscriptionsTable.$inferSelect,
	'id' | 'custom_name' | 'billing_cycle_type' | 'billing_cycle_value'
> & {
	current_price: (typeof timelineEventsTable.$inferSelect)['amount'];
	service_title: (typeof servicesTable.$inferSelect)['title'];
	service_slug: (typeof servicesTable.$inferSelect)['slug'];
	service_logo_url: (typeof servicesTable.$inferSelect)['logo_url'];
	service_symbol: (typeof servicesTable.$inferSelect)['symbol'];
	service_color: (typeof servicesTable.$inferSelect)['color'];
	currency_code: (typeof currenciesTable.$inferSelect)['id'] | null;
	denominator: (typeof currenciesTable.$inferSelect)['denominator'] | null;
	fraction_digits: (typeof currenciesTable.$inferSelect)['fraction_digits'] | null;
	intl_locale: (typeof currenciesTable.$inferSelect)['intl_locale'] | null;
};

export const useCategory = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [category, setCategory] = useState<typeof categoriesTable.$inferSelect | undefined>();
	const [subscriptions, setSubscriptions] = useState<CategorySubscriptionT[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const categories = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, id));

			if (cancelled) return;
			setCategory(first(categories));

			const subs = await db
				.select({
					id: subscriptionsTable.id,
					custom_name: subscriptionsTable.custom_name,
					current_price: timelineEventsTable.amount,
					billing_cycle_type: subscriptionsTable.billing_cycle_type,
					billing_cycle_value: subscriptionsTable.billing_cycle_value,
					service_title: servicesTable.title,
					service_slug: servicesTable.slug,
					service_logo_url: servicesTable.logo_url,
					service_symbol: servicesTable.symbol,
					service_color: servicesTable.color,
					currency_code: currenciesTable.id,
					denominator: currenciesTable.denominator,
					fraction_digits: currenciesTable.fraction_digits,
					intl_locale: currenciesTable.intl_locale
				})
				.from(subscriptionsTable)
				.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
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
				.where(eq(subscriptionsTable.category_slug, id));

			if (cancelled) return;
			setSubscriptions(subs);
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

	return { category, subscriptions };
};
