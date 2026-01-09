import { inArray, and } from 'drizzle-orm';
import { currenciesTable, servicesTable, tendersTable, categoriesTable } from '@db/schema';

import type { SQL } from 'drizzle-orm';
import type { AppliedFilterT } from '@models/app-model.d';

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
