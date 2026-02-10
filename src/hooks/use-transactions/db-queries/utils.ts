import { startOfToday } from 'date-fns';

import { inArray, gte, and } from 'drizzle-orm';
import { transactionsTable, currenciesTable, servicesTable, tendersTable, categoriesTable } from '@db/schema';

import type { SQL } from 'drizzle-orm';
import type { AppliedFilterT, TimeModesT } from '@screens/transactions/models/types.d';

/* Master Filters */
const filterTypeToIdColumn = {
	category: categoriesTable.id,
	service: servicesTable.id,
	currency: currenciesTable.id,
	tender: tendersTable.id
} as const;

export const buildWhereConditions = (filters: AppliedFilterT[]) => {
	const conditions: SQL[] = [];

	for (const type in filterTypeToIdColumn) {
		const ids = filters.reduce((acc, filter) => {
			if (filter.type === type) {
				acc.push(filter.value);
			}

			return acc;
		}, [] as string[]);

		if (ids.length > 0) {
			const id = filterTypeToIdColumn[type as keyof typeof filterTypeToIdColumn];

			conditions.push(inArray(id, ids));
		}
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
};

export const timeModeClause = (timeMode: TimeModesT) => {
	if (timeMode === 'future') {
		const today = startOfToday();

		return gte(transactionsTable.date, today.toISOString());
	}

	return undefined;
};

export const globalFiltersClause = (withFilters: boolean, filters: AppliedFilterT[]) => {
	if (withFilters) {
		return buildWhereConditions(filters);
	}

	return undefined;
};
