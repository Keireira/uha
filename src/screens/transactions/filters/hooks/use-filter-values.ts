import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useTranslation } from 'react-i18next';

import db from '@db';
import { eq, inArray } from 'drizzle-orm';
import {
	tendersTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';

import type { ActiveEntryT } from '../filters.d';

type CoalesceDataT = {
	id: string;
	title: string | null;
	emoji?: string | null;
	subtitle?: string | null;
};

const coalesce = (data: CoalesceDataT[]): ActiveEntryT[] => {
	const result = data.map(({ id, title, subtitle, emoji }) => {
		const label = title ?? id;

		return {
			id,
			title: emoji ? `${emoji}  ${label}` : label,
			subtitle: subtitle ?? undefined
		};
	});

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
			.leftJoin(categoriesTable, eq(servicesTable.category_slug, categoriesTable.slug))
			.where(
				inArray(
					servicesTable.id,
					db
						.selectDistinct({ id: subscriptionsTable.service_id })
						.from(subscriptionsTable)
						.innerJoin(transactionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
				)
			)
	);

	/* Filtered Categories */
	const { data: categories } = useLiveQuery(
		db
			.selectDistinct({
				slug: categoriesTable.slug,
				title: categoriesTable.title,
				emoji: categoriesTable.emoji
			})
			.from(categoriesTable)
			.where(
				inArray(
					categoriesTable.slug,
					db
						.selectDistinct({ id: subscriptionsTable.category_slug })
						.from(subscriptionsTable)
						.innerJoin(transactionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
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
			.where(inArray(tendersTable.id, db.selectDistinct({ id: transactionsTable.tender_id }).from(transactionsTable)))
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
				inArray(currenciesTable.id, db.selectDistinct({ id: transactionsTable.currency_id }).from(transactionsTable))
			)
	);

	const mappedCategories = categories.map((c) => ({ id: c.slug, title: c.title, emoji: c.emoji }));

	return {
		services: coalesce(services),
		categories: coalesce(mappedCategories),
		tenders: coalesce(tenders),
		currencies: coalesce(currencies)
	} satisfies UseFilterValuesReturnT;
};

export default useFilterValues;
