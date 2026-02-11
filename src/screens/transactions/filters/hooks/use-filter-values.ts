import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

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
				id: categoriesTable.id,
				title: categoriesTable.title,
				emoji: categoriesTable.emoji
			})
			.from(categoriesTable)
			.where(
				inArray(
					categoriesTable.id,
					db
						.selectDistinct({ id: subscriptionsTable.category_id })
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

	return {
		services: coalesce(services),
		categories: coalesce(categories),
		tenders: coalesce(tenders),
		currencies: coalesce(currencies)
	} satisfies UseFilterValuesReturnT;
};

export default useFilterValues;
