import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { eq, and, gte, lte } from 'drizzle-orm';
import {
	transactionsTable,
	currenciesTable,
	servicesTable,
	subscriptionsTable,
	categoriesTable,
	tendersTable
} from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { buildWhereConditions } from '../transactions/utils';

import { Text } from '@ui';
import Root, { Card } from './summaries.styles';

const Summaries = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: transactionsYear } = useLiveQuery(
		db
			.select({
				amount: transactionsTable.amount
			})
			.from(transactionsTable)
			.leftJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(
				and(
					buildWhereConditions(lensesStore.filters, 'all'),
					lte(transactionsTable.date, endOfYear(new Date()).toISOString()),
					gte(transactionsTable.date, startOfYear(new Date()).toISOString())
				)
			),
		[lensesStore.filters]
	);

	const { data: transactionsCurrentMonth } = useLiveQuery(
		db
			.select({
				amount: transactionsTable.amount
			})
			.from(transactionsTable)
			.leftJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(
				and(
					buildWhereConditions(lensesStore.filters, 'all'),
					lte(transactionsTable.date, endOfMonth(new Date()).toISOString()),
					gte(transactionsTable.date, startOfMonth(new Date()).toISOString())
				)
			),
		[lensesStore.filters]
	);

	const totalYear = useMemo(() => {
		if (!transactionsYear) return 0;

		return transactionsYear.reduce((acc, curr) => acc + curr.amount, 0);
	}, [transactionsYear]);

	const totalMonth = useMemo(() => {
		if (!transactionsCurrentMonth) return 0;

		return transactionsCurrentMonth.reduce((acc, curr) => acc + curr.amount, 0);
	}, [transactionsCurrentMonth]);

	return (
		<Root>
			<Card>
				<Text>${totalMonth}</Text>
				<Text $bold>In January</Text>
			</Card>

			<Card>
				<Text>${totalYear}</Text>
				<Text $bold>In 2026</Text>
			</Card>
		</Root>
	);
};

export default React.memo(Summaries);
