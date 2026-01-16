import { categoriesTable, tendersTable, servicesTable } from '@db/schema';
import { db as drizzleDB } from '@src/sql-migrations';

import type { InferSelectModel } from 'drizzle-orm';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type TenderT = InferSelectModel<typeof tendersTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;

// SCROLL MODEL
export type ScrollDirection = 'up' | 'down' | 'idle';
