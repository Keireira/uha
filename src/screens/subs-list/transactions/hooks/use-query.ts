import { useMemo } from 'react';
import { groupBy } from 'ramda';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

import { db } from '@src/sql-migrations';
import { eq, asc, and } from 'drizzle-orm';
import {
	tendersTable,
	servicesTable,
	categoriesTable,
	currenciesTable,
	transactionsTable,
	subscriptionsTable
} from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { buildWhereConditions, buildForFeed } from '@screens/subs-list/utils';

import type { UseTranslationResponse } from 'react-i18next';
import type { TransactionProps } from '../transaction-card/transaction-card.d';

type TI18nT = UseTranslationResponse<string, undefined>['t'];

/* Fetch transactions from DB */
const useTransactionsQuery = () => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	const { data: transactions } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				price: transactionsTable.amount,
				slug: servicesTable.slug,
				title: servicesTable.title,
				customName: subscriptionsTable.custom_name,
				emoji: categoriesTable.emoji,
				category: categoriesTable.title,
				color: servicesTable.color,
				date: transactionsTable.date
			})
			.from(transactionsTable)
			.leftJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.leftJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.orderBy(asc(transactionsTable.date))
			.where(and(buildWhereConditions(lensesStore.filters), buildForFeed(lensesStore.time_mode))),
		[lensesStore.filters, lensesStore.time_mode]
	);

	return transactions satisfies TransactionProps[];
};

/* Generate transactions sections */
const makeGroups = groupBy((tx: TransactionProps) => {
	return format(new Date(tx.date), 'yyyy-MM-dd');
});

/* @TODO: Maybe we should use formatRelative (date-fns) here? */
const getDateLabel = (date: Date, t: TI18nT) => {
	if (isToday(date)) return t('dates.today');
	if (isTomorrow(date)) return t('dates.tomorrow');
	if (isYesterday(date)) return t('dates.yesterday');

	const isCurrentYear = date.getFullYear() === new Date().getFullYear();

	return format(date, isCurrentYear ? 'dd MMMM' : 'dd MMMM, yyyy');
};

const useTransactionsSections = () => {
	const { t } = useTranslation();
	const transactions = useTransactionsQuery();

	const sections = useMemo(() => {
		const groupedByDate = makeGroups(transactions);

		const sectioned = Object.entries(groupedByDate).flatMap(([_, txs]) => {
			if (!txs) return [];

			const date = new Date(txs[0].date);
			const dateLabel = getDateLabel(date, t);

			return [dateLabel, ...txs];
		});

		return sectioned;
	}, [t, transactions]);

	return sections satisfies (string | TransactionProps)[];
};

export default useTransactionsSections;
