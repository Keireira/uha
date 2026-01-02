import { and, inArray, gte } from 'drizzle-orm';
import { transactionsTable, currenciesTable, servicesTable, categoriesTable, tendersTable } from '@db/schema';

import type { AppliedFilterT, TimeModesT } from '@models/app-model.d';

export const buildWhereConditions = (filters: AppliedFilterT[], timeMode: TimeModesT) => {
	const conditions = [];

	const categoryFilters = filters.filter((f) => f.type === 'category').map((f) => f.value);
	if (categoryFilters.length > 0) {
		conditions.push(inArray(categoriesTable.id, categoryFilters));
	}

	const serviceFilters = filters.filter((f) => f.type === 'service').map((f) => f.value);
	if (serviceFilters.length > 0) {
		conditions.push(inArray(servicesTable.id, serviceFilters));
	}

	const currencyFilters = filters.filter((f) => f.type === 'currency').map((f) => f.value);
	if (currencyFilters.length > 0) {
		conditions.push(inArray(currenciesTable.id, currencyFilters));
	}

	const tenderFilters = filters.filter((f) => f.type === 'tender').map((f) => f.value);
	if (tenderFilters.length > 0) {
		conditions.push(inArray(tendersTable.id, tenderFilters));
	}

	if (timeMode === 'future') {
		conditions.push(gte(transactionsTable.date, new Date().toISOString()));
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
};
