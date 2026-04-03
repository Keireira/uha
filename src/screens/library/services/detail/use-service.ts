import { useState, useEffect } from 'react';
import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { servicesTable, categoriesTable, subscriptionsTable, currenciesTable, tendersTable } from '@db/schema';

export const useService = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [service, setService] = useState<Record<string, any> | undefined>();
	const [subscriptions, setSubscriptions] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const services = await db
				.select({
					id: servicesTable.id,
					title: servicesTable.title,
					slug: servicesTable.slug,
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
					current_price: subscriptionsTable.current_price,
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
				.innerJoin(currenciesTable, eq(subscriptionsTable.current_currency_id, currenciesTable.id))
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
