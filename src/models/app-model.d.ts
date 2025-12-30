import { categoriesTable, tendersTable, servicesTable } from '@db/schema';
import { db as drizzleDB } from '@src/sql-migrations';

import type { InferSelectModel } from 'drizzle-orm';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type TenderT = InferSelectModel<typeof tendersTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;

// SCROLL MODEL
export type ScrollDirection = 'up' | 'down' | 'idle';

// LENSES (FILTERS) MODEL
export type TimeModesT = 'all' | 'future';
export type FilterTypeT = 'category' | 'service' | 'tender' | 'currency' | 'list';

export type AppliedFilterT = {
	type: FilterTypeT;
	value: string;
};

export type LensesModel = {
	time_mode: TimeModesT;
	wo_twins: boolean; // Show in the future each subscription only once
	applied_filters: AppliedFilterT[];
};
