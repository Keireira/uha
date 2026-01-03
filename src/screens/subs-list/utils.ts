import { and, inArray, lte, gte } from 'drizzle-orm';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { transactionsTable, currenciesTable, servicesTable, categoriesTable, tendersTable } from '@db/schema';

import type { SQL } from 'drizzle-orm';
import type { AppliedFilterT, TimeModesT } from '@models/app-model.d';

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

/* For Summaries */
const timeFrameFns = {
	month: { start: startOfMonth, end: endOfMonth },
	year: { start: startOfYear, end: endOfYear }
} as const;

export const buildForSummaries = (timeFrame: keyof typeof timeFrameFns, viewableDate: Date) => {
	const fns = timeFrameFns[timeFrame];
	if (!fns) return undefined;

	return and(
		gte(transactionsTable.date, fns.start(viewableDate).toISOString()),
		lte(transactionsTable.date, fns.end(viewableDate).toISOString())
	);
};

/* For Feed */
export const buildForFeed = (timeMode: TimeModesT) => {
	if (timeMode === 'future') {
		return gte(transactionsTable.date, new Date().toISOString());
	}

	return undefined;
};
