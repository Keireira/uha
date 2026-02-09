import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { eq, isNull, inArray } from 'drizzle-orm';
import { categoriesTable, currenciesTable, servicesTable, subscriptionsTable, tendersTable } from '@db/schema';

import type { ActiveEntryT } from '../filters.d';

const useFilterValues = () => {
	// Services — with category title as subtitle
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

	// Categories — emoji is prepended to title inline
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

	// Tenders — with comment as subtitle
	const { data: tenders } = useLiveQuery(
		db
			.selectDistinct({
				id: tendersTable.id,
				title: tendersTable.title,
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

	// Currencies — id is the code (e.g. "USD"), title is the code too
	// The display name will be resolved via i18n in the component
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

	const coalesce = (data: { id: string; title: string; subtitle?: string | null }[]): ActiveEntryT[] =>
		data.map(({ id, title, subtitle }) => ({
			id,
			title,
			subtitle: subtitle ?? undefined
		}));

	const categoriesWithEmoji: ActiveEntryT[] = categories.map(({ id, title, emoji }) => ({
		id,
		title: emoji ? `${emoji}  ${title}` : title
	}));

	return {
		services: coalesce(services),
		categories: categoriesWithEmoji,
		tenders: coalesce(tenders),
		currencies: currencies satisfies ActiveEntryT[]
	};
};

export default useFilterValues;
