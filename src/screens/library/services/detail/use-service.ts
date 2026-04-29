import { useState, useEffect } from 'react';
import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { and, eq, inArray, max } from 'drizzle-orm';
import {
	servicesTable,
	categoriesTable,
	subscriptionsTable,
	currenciesTable,
	tendersTable,
	timelineEventsTable
} from '@db/schema';

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

type ServiceDetailT = Pick<
	typeof servicesTable.$inferSelect,
	'id' | 'title' | 'slug' | 'logo_url' | 'symbol' | 'color'
> & {
	category_title: (typeof categoriesTable.$inferSelect)['title'];
	category_emoji: (typeof categoriesTable.$inferSelect)['emoji'];
	category_color: (typeof categoriesTable.$inferSelect)['color'];
};

type ServiceSubscriptionT = Pick<
	typeof subscriptionsTable.$inferSelect,
	'id' | 'custom_name' | 'billing_cycle_type' | 'billing_cycle_value'
> & {
	current_price: (typeof timelineEventsTable.$inferSelect)['amount'];
	currency_code: (typeof currenciesTable.$inferSelect)['id'] | null;
	denominator: (typeof currenciesTable.$inferSelect)['denominator'] | null;
	fraction_digits: (typeof currenciesTable.$inferSelect)['fraction_digits'] | null;
	intl_locale: (typeof currenciesTable.$inferSelect)['intl_locale'] | null;
	tender_emoji: (typeof tendersTable.$inferSelect)['emoji'] | null;
	tender_title: (typeof tendersTable.$inferSelect)['title'] | null;
};

export const useService = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [service, setService] = useState<ServiceDetailT | undefined>();
	const [subscriptions, setSubscriptions] = useState<ServiceSubscriptionT[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const services = await db
				.select({
					id: servicesTable.id,
					title: servicesTable.title,
					slug: servicesTable.slug,
					logo_url: servicesTable.logo_url,
					symbol: servicesTable.symbol,
					color: servicesTable.color,
					category_title: categoriesTable.title,
					category_emoji: categoriesTable.emoji,
					category_color: categoriesTable.color
				})
				.from(servicesTable)
				.innerJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
				.where(eq(servicesTable.id, id));

			if (cancelled) return;
			setService(first(services));

			const subs = await db
				.select({
					id: subscriptionsTable.id,
					custom_name: subscriptionsTable.custom_name,
					current_price: timelineEventsTable.amount,
					billing_cycle_type: subscriptionsTable.billing_cycle_type,
					billing_cycle_value: subscriptionsTable.billing_cycle_value,
					currency_code: currenciesTable.id,
					denominator: currenciesTable.denominator,
					fraction_digits: currenciesTable.fraction_digits,
					intl_locale: currenciesTable.intl_locale,
					tender_emoji: tendersTable.emoji,
					tender_title: tendersTable.title
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
				.leftJoin(tendersTable, eq(subscriptionsTable.tender_id, tendersTable.id))
				.where(eq(subscriptionsTable.service_id, id));

			if (cancelled) return;
			setSubscriptions(subs);
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

	return { service, subscriptions };
};
