import { useMemo } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import db from '@db';
import { and, eq, isNull, inArray } from 'drizzle-orm';
import { servicesTable, subscriptionsTable } from '@db/schema';

import type { AppliedFilterT } from '@screens/transactions/models/types.d';
import type { FilterTabT } from '../components/filter-sheet/filter-sheet.d';

/**
 * Returns sets of eligible IDs for each filter tab, based on which
 * filters are currently active in OTHER tabs.
 *
 * E.g. if "Entertainment" category is selected, eligible services
 * are only those whose category_id matches a subscription in that category.
 */
const useEligibleIds = (filters: AppliedFilterT[]) => {
	const categoryFilters = useMemo(
		() => filters.filter((f) => f.type === 'category').map((f) => f.value),
		[filters]
	);
	const serviceFilters = useMemo(
		() => filters.filter((f) => f.type === 'service').map((f) => f.value),
		[filters]
	);
	const tenderFilters = useMemo(
		() => filters.filter((f) => f.type === 'tender').map((f) => f.value),
		[filters]
	);
	const currencyFilters = useMemo(
		() => filters.filter((f) => f.type === 'currency').map((f) => f.value),
		[filters]
	);

	// Get all active subscriptions (non-cancelled)
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

		if (!subscriptions.length) return result;

		const hasFilters = (arr: string[]) => arr.length > 0;

		for (const sub of subscriptions) {
			// For each tab, check if the subscription matches ALL other tab filters
			const matchesCategory = !hasFilters(categoryFilters) || categoryFilters.includes(sub.category_id);
			const matchesService = !hasFilters(serviceFilters) || serviceFilters.includes(sub.service_id);
			const matchesTender = !hasFilters(tenderFilters) || !sub.tender_id || tenderFilters.includes(sub.tender_id);
			const matchesCurrency = !hasFilters(currencyFilters) || currencyFilters.includes(sub.currency_id);

			// Eligible for category tab: subscription matches service + tender + currency filters
			if (matchesService && matchesTender && matchesCurrency) {
				result.category.add(sub.category_id);
			}

			// Eligible for service tab: subscription matches category + tender + currency filters
			if (matchesCategory && matchesTender && matchesCurrency) {
				result.service.add(sub.service_id);
			}

			// Eligible for tender tab: subscription matches category + service + currency filters
			if (sub.tender_id && matchesCategory && matchesService && matchesCurrency) {
				result.tender.add(sub.tender_id);
			}

			// Eligible for currency tab: subscription matches category + service + tender filters
			if (matchesCategory && matchesService && matchesTender) {
				result.currency.add(sub.currency_id);
			}
		}

		return result;
	}, [subscriptions, categoryFilters, serviceFilters, tenderFilters, currencyFilters]);

	return eligibleIds;
};

export default useEligibleIds;
