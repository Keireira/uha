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
// import { useCreatePhantomTxs } from '@lib';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { buildWhereConditions, buildForFeed } from '@screens/subs-list/utils';

import type { HeaderSectionT, TI18nT } from '../transactions.d';
import type { TransactionProps } from '../transaction-card/transaction-card.d';

/* Fetch transactions from DB */
const useTransactionsQuery = () => {
	const { lenses } = useAppModel();
	// const phantomTxs = useCreatePhantomTxs();
	const phantomTxs = [];
	const lensesStore = useUnit(lenses.$store);

	const { data: dbTxs } = useLiveQuery(
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

	return useMemo(() => {
		// console.log('[PHANTOM TXS]:', phantomTxs.length);
		const all = [...dbTxs, ...phantomTxs];
		return all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [dbTxs, phantomTxs]);
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

	return format(date, isCurrentYear ? 'd MMMM' : 'd MMMM, yyyy');
};

const calcTotalAmount = (txs: TransactionProps[]) => {
	const total = txs.reduce((acc, tx) => acc + tx.price / (tx.denominator || 1), 0);
	const formattedTotal = total.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: total > 1000 ? 0 : 2
	});

	return formattedTotal;
};

const useTransactionsSections = () => {
	const { t } = useTranslation();
	const transactions = useTransactionsQuery();

	const sections = useMemo(() => {
		const groupedByDate = makeGroups(transactions);

		const sectioned = Object.entries(groupedByDate).flatMap(([_, txs]) => {
			if (!txs) return [];

			const date = new Date(txs[0].date);
			const rightPart = txs.length > 1 ? calcTotalAmount(txs) : null;
			const dateLabel = getDateLabel(date, t);

			const headerSection: HeaderSectionT = {
				type: 'sectionHeader',
				date: dateLabel,
				total: rightPart
			};

			return [headerSection, ...txs];
		});

		return sectioned;
	}, [t, transactions]);

	return sections satisfies (HeaderSectionT | TransactionProps)[];
};

export default useTransactionsSections;
