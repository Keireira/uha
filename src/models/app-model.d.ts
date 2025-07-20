import { categoriesTable, paymentMethodsTable, servicesTable } from '@db/schema';
import { db as drizzleDB } from '@src/sql-migrations';

import type { InferSelectModel } from 'drizzle-orm';

export type ScrollDirection = 'up' | 'down' | 'idle';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type PaymentT = InferSelectModel<typeof paymentMethodsTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;
