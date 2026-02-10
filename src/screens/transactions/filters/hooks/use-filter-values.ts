import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { eq, isNull, inArray } from 'drizzle-orm';
import { categoriesTable, currenciesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

import type { ActiveEntryT } from '../filters.d';

type CoalesceDataT = {
	id: string;
	title: string;
	emoji?: string | null;
	subtitle?: string | null;
};

const coalesce = (data: CoalesceDataT[]): ActiveEntryT[] => {
	const result = data.map(({ id, title, subtitle, emoji }) => ({
		id,
		title: emoji ? `${emoji}  ${title}` : title,
		subtitle: subtitle ?? undefined
	}));

	return result satisfies ActiveEntryT[];
};

type UseFilterValuesReturnT = {
	services: ActiveEntryT[];
	categories: ActiveEntryT[];
	tenders: ActiveEntryT[];
	currencies: ActiveEntryT[];
};

const useFilterValues = () => {
	/* Filtered Services */
	const { data: services } = useLiveQuery(
		db
			.select({
				id: servicesTable.id,
				title: servicesTable.title,
				subtitle: categoriesTable.title
			})
			.from(servicesTable)
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.where(
				inArray(
					servicesTable.id,
					db
						.select({ id: subscriptionsTable.service_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	/* Filtered Categories */
	const { data: categories } = useLiveQuery(
		db
			.selectDistinct({
				id: categoriesTable.id,
				title: categoriesTable.title,
				emoji: categoriesTable.emoji
			})
			.from(categoriesTable)
			.where(
				inArray(
					categoriesTable.id,
					db
						.select({ id: servicesTable.category_id })
						.from(servicesTable)
						.innerJoin(subscriptionsTable, eq(subscriptionsTable.service_id, servicesTable.id))
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	/* Filtered Tenders */
	const { data: tenders } = useLiveQuery(
		db
			.selectDistinct({
				id: tendersTable.id,
				title: tendersTable.title,
				emoji: tendersTable.emoji,
				subtitle: tendersTable.comment
			})
			.from(tendersTable)
			.where(
				inArray(
					tendersTable.id,
					db
						.select({ id: subscriptionsTable.tender_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	/**
	 * Filtered Currencies
	 * - id is the code (e.g. "USD"), title is the code too btw
	 * - display name will be resolved via i18n in the component
	 */
	const { data: currencies } = useLiveQuery(
		db
			.selectDistinct({
				id: currenciesTable.id,
				title: currenciesTable.id
			})
			.from(currenciesTable)
			.where(
				inArray(
					currenciesTable.id,
					db
						.select({ id: subscriptionsTable.current_currency_id })
						.from(subscriptionsTable)
						.where(isNull(subscriptionsTable.cancellation_date))
				)
			)
	);

	return {
		services: coalesce(services),
		categories: coalesce(categories),
		tenders: coalesce(tenders),
		currencies: coalesce(currencies)
	} satisfies UseFilterValuesReturnT;
};

export default useFilterValues;
