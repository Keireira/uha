import { categoriesTable, paymentMethodsTable, servicesTable } from '@db/schema';
import { db as drizzleDB } from '@src/sql-migrations';

import type { InferSelectModel } from 'drizzle-orm';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type PaymentT = InferSelectModel<typeof paymentMethodsTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;

// SCROLL MODEL
export type ScrollDirection = 'up' | 'down' | 'idle';

// LENSES (FILTERS) MODEL
export type LensT = 'upcoming' | 'past_and_upcoming' | 'selected_period' | 'infinite';
export type FilterTypeT = 'category' | 'service' | 'tender' | 'currency' | 'list';

export type AppliedFilterT = {
	type: FilterTypeT;
	value: string;
	label: string;
};

export type LensesModel = {
	primary_lens: LensT;
	start_date: Date | null;
	end_date: Date | null;
	applied_filters: AppliedFilterT[];
};
