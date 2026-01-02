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
import Root, { TextRow, SummaryItem, CategoryChips, CategoryChip } from './summaries.styles';

const Summaries = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: transactionsYear } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				amount: transactionsTable.amount,
				category_id: categoriesTable.id,
				category_color: categoriesTable.color
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
				id: transactionsTable.id,
				amount: transactionsTable.amount,
				category_id: categoriesTable.id,
				category_color: categoriesTable.color
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

	const currentMonth = useMemo(() => {
		return startOfMonth(new Date()).toLocaleDateString('en-US', { month: 'long' });
	}, []);

	const currentYear = useMemo(() => {
		return startOfYear(new Date()).toLocaleDateString('en-US', { year: 'numeric' });
	}, []);

	const totalYear = useMemo(() => {
		if (!transactionsYear) return 0;

		return transactionsYear.reduce((acc, curr) => acc + curr.amount, 0);
	}, [transactionsYear]);

	const totalMonth = useMemo(() => {
		if (!transactionsCurrentMonth) return 0;

		return transactionsCurrentMonth.reduce((acc, curr) => acc + curr.amount, 0);
	}, [transactionsCurrentMonth]);

	const categoriesMonth = useMemo(() => {
		if (!transactionsCurrentMonth) return {};

		const { total, ...sum } = transactionsCurrentMonth.reduce(
			(acc, cur) => {
				if (!cur.category_id) return acc;

				acc[cur.category_id] ??= {
					id: cur.category_id,
					amount: 0,
					color: cur.category_color || '#ffffff'
				};

				acc[cur.category_id].amount += cur.amount;

				acc.total += cur.amount;

				return acc;
			},
			{ total: 0 }
		);

		return {
			tmp: Object.values(sum).sort((a, b) => b.amount - a.amount),
			total
		};
	}, [transactionsCurrentMonth]);

	const categoriesYear = useMemo(() => {
		if (!transactionsYear) return {};

		const { total, ...sum } = transactionsYear.reduce(
			(acc, cur) => {
				if (!cur.category_id) return acc;

				acc[cur.category_id] ??= {
					id: cur.category_id,
					amount: 0,
					color: cur.category_color || '#ffffff'
				};

				acc[cur.category_id].amount += cur.amount;

				acc.total += cur.amount;

				return acc;
			},
			{ total: 0 }
		);

		return {
			tmp: Object.values(sum).sort((a, b) => b.amount - a.amount),
			total
		};
	}, [transactionsYear]);

	return (
		<Root>
			<SummaryItem>
				<TextRow>
					<Text>${totalMonth}</Text>
					<Text $bold>In {currentMonth}</Text>
				</TextRow>

				<CategoryChips>
					{categoriesMonth.tmp.map((category) => {
						const percentage = (category.amount / categoriesMonth.total) * 100;

						return <CategoryChip key={category.id} $color={category.color} $percentage={percentage} />;
					})}
				</CategoryChips>
			</SummaryItem>

			<SummaryItem>
				<TextRow>
					<Text>${totalYear}</Text>
					<Text $bold>In {currentYear}</Text>
				</TextRow>

				<CategoryChips>
					{categoriesYear.tmp.map((category) => {
						const percentage = (category.amount / categoriesYear.total) * 100;

						return <CategoryChip key={category.id} $color={category.color} $percentage={percentage} />;
					})}
				</CategoryChips>
			</SummaryItem>
		</Root>
	);
};

export default React.memo(Summaries);
