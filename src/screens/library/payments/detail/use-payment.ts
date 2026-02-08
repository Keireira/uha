import { first } from '@lib';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { tendersTable, subscriptionsTable, servicesTable, categoriesTable, currenciesTable } from '@db/schema';

export const usePayment = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: payments } = useLiveQuery(db.select().from(tendersTable).where(eq(tendersTable.id, id)));

	const { data: subscriptions } = useLiveQuery(
		db
			.select({
				id: subscriptionsTable.id,
				custom_name: subscriptionsTable.custom_name,
				current_price: subscriptionsTable.current_price,
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
			.innerJoin(categoriesTable, eq(subscriptionsTable.category_id, categoriesTable.id))
			.innerJoin(currenciesTable, eq(subscriptionsTable.current_currency_id, currenciesTable.id))
			.where(eq(subscriptionsTable.tender_id, id))
	);

	return { payment: first(payments), subscriptions };
};
