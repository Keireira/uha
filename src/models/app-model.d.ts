import { categoriesTable, tendersTable, servicesTable, transactionsTable, subscriptionsTable } from '@db/schema';
import drizzleDB from '@db';

import type { InferSelectModel } from 'drizzle-orm';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type TenderT = InferSelectModel<typeof tendersTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;
export type TransactionT = InferSelectModel<typeof transactionsTable>;
export type SubscriptionT = InferSelectModel<typeof subscriptionsTable>;

// SCROLL MODEL
export type ScrollDirection = 'up' | 'down' | 'idle';
