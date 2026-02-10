import { useMemo } from 'react';

import db from '@db';
import { eq, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { servicesTable, subscriptionsTable } from '@db/schema';

import type { FilterTabT } from '../filters.d';
import type { FilterTypeT, AppliedFilterT } from '@screens/transactions/models/types.d';

const noFilters = (filters: string[]) => !filters.length;

const filterByType = (type: FilterTypeT) => (acc: string[], filter: AppliedFilterT) => {
	if (filter.type === type) {
		acc.push(filter.value);
	}

	return acc;
};

/**
 * Returns sets of eligible IDs for each filter tab, based on which
 * filters are currently active in OTHER tabs.
 *
 * E.g. if "Entertainment" category is selected, eligible services
 * are only those whose category_id matches a subscription in that category.
 */
const useEligibleIds = (appliedFilters: AppliedFilterT[]) => {
	const filters = useMemo(() => {
		const result: Record<FilterTabT, string[]> = {
			category: appliedFilters.reduce(filterByType('category'), [] as string[]),
			service: appliedFilters.reduce(filterByType('service'), [] as string[]),
			tender: appliedFilters.reduce(filterByType('tender'), [] as string[]),
			currency: appliedFilters.reduce(filterByType('currency'), [] as string[])
		};

		return result;
	}, [appliedFilters]);

	/* Get all active subscriptions */
	const { data: subscriptions } = useLiveQuery(
		db
			.select({
				category_id: subscriptionsTable.category_id,
				service_id: subscriptionsTable.service_id,
				tender_id: subscriptionsTable.tender_id,
				currency_id: subscriptionsTable.current_currency_id
			})
			.from(subscriptionsTable)
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.where(isNull(subscriptionsTable.cancellation_date))
	);

	const eligibleIds = useMemo(() => {
		const result: Record<FilterTabT, Set<string>> = {
			category: new Set(),
			service: new Set(),
			tender: new Set(),
			currency: new Set()
		};

		if (!subscriptions.length) {
			return result;
		}

		for (const sub of subscriptions) {
			/**
			 * For each tab, check if the subscription matches all other tab filters
			 * - noFilters: obv you will match sub if no filters has been applied
			 * - tender_id: may be null, but we can check if it's included in the filters anyway, so '!' is needed
			 */
			const matchesCategory = noFilters(filters.category) || filters.category.includes(sub.category_id);
			const matchesService = noFilters(filters.service) || filters.service.includes(sub.service_id);
			const matchesTender = noFilters(filters.tender) || filters.tender.includes(sub.tender_id!);
			const matchesCurrency = noFilters(filters.currency) || filters.currency.includes(sub.currency_id);

			/* Eligible for category tab: subscription matches 'service + tender + currency' filters */
			if (matchesService && matchesTender && matchesCurrency) {
				result.category.add(sub.category_id);
			}

			/* Eligible for service tab: subscription matches 'category + tender + currency' filters */
			if (matchesCategory && matchesTender && matchesCurrency) {
				result.service.add(sub.service_id);
			}

			/* Eligible for tender tab: subscription matches 'category + service + currency' filters */
			if (sub.tender_id && matchesCategory && matchesService && matchesCurrency) {
				result.tender.add(sub.tender_id);
			}

			/* Eligible for currency tab: subscription matches 'category + service + tender' filters */
			if (matchesCategory && matchesService && matchesTender) {
				result.currency.add(sub.currency_id);
			}
		}

		return result;
	}, [subscriptions, filters]);

	return eligibleIds;
};

export default useEligibleIds;
