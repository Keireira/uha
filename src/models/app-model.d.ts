import {
	categoriesTable,
	subscriptionsTable,
	transactionsTable,
	servicesTable,
	tendersTable,
	currenciesTable,
	currencyRatesTable,
	timelineEventsTable,
	userTable
} from '@db/schema';
import drizzleDB from '@db';

import type { InferSelectModel } from 'drizzle-orm';

export type DBT = typeof drizzleDB;

export type CategoryT = InferSelectModel<typeof categoriesTable>;
export type UserT = InferSelectModel<typeof userTable>;
export type TenderT = InferSelectModel<typeof tendersTable>;
export type ServiceT = InferSelectModel<typeof servicesTable>;
export type TransactionT = InferSelectModel<typeof transactionsTable>;
export type SubscriptionT = InferSelectModel<typeof subscriptionsTable>;
export type CurrencyT = InferSelectModel<typeof currenciesTable>;
export type CurrencyRateT = InferSelectModel<typeof currencyRatesTable>;
export type TimelineEventT = InferSelectModel<typeof timelineEventsTable>;

// SCROLL MODEL
export type ScrollDirection = 'up' | 'down' | 'idle';
