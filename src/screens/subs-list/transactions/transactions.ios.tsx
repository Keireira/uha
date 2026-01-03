import React, { useRef, useCallback, useMemo } from 'react';
import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns';
import { useUnit } from 'effector-react';
import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { useScrollDirection } from '@hooks';
import { eq, asc } from 'drizzle-orm';
import {
	transactionsTable,
	currenciesTable,
	servicesTable,
	subscriptionsTable,
	categoriesTable,
	tendersTable
} from '@db/schema';
import { buildWhereConditions } from './utils';

import { H4 } from '@ui';
import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, ItemSeparator, BottomSpacer } from './transactions.styles';

import type { TransactionProps } from './transaction-card/transaction-card.d';

type SectionT = (string | TransactionProps)[];

const renderItem = ({ item }: { item: SectionT }) => {
	if (typeof item === 'string') {
		return (
			<H4 $align="left" $weight={700} style={{ marginHorizontal: 16, marginTop: 16 }}>
				{item}
			</H4>
		);
	}

	return <TransactionCard {...(item as unknown as TransactionProps)} />;
};

const Transactions = () => {
	const insets = useSafeAreaInsets();
	const { lenses, scroll } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const handleScroll = useScrollDirection();
	const listRef = useRef(null);

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
			.where(buildWhereConditions(lensesStore.filters, lensesStore.time_mode)),
		[lensesStore.filters, lensesStore.time_mode]
	);

	const sections = useMemo(() => {
		const formattedSections = transactions.reduce((acc, transaction, index) => {
			const prevTransaction = transactions[index - 1];
			const transactionDate = new Date(transaction.date);

			let dateLabel = '';

			if (isToday(transactionDate)) {
				dateLabel = 'Today';
			} else if (isTomorrow(transactionDate)) {
				dateLabel = 'Tomorrow';
			} else if (isYesterday(transactionDate)) {
				dateLabel = 'Yesterday';
			} else {
				const isCurrentYear = transactionDate.getFullYear() === new Date().getFullYear();

				dateLabel = format(transactionDate, isCurrentYear ? 'dd MMM' : 'dd MMM, yyyy');
			}

			const dateKey = format(transactionDate, 'dd-yyyy-MM');
			const prevDateKey = prevTransaction ? format(new Date(prevTransaction.date), 'dd-yyyy-MM') : null;

			if (dateKey !== prevDateKey) {
				acc.push(dateLabel);
			}

			acc.push(transaction as TransactionProps);

			return acc;
		}, [] as SectionT);

		return formattedSections;
	}, [transactions]);

	const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
		if (viewableItems.length === 0) return;

		const index = Math.floor(viewableItems.length / 2);

		let middleItem = viewableItems[index]?.item;

		if (typeof middleItem === 'string') {
			middleItem = viewableItems[index + 1]?.item;
		}

		if (middleItem) {
			const dates = new Date(middleItem.date);

			scroll.setViewableDate(dates);
		}
	}, []);

	return (
		<Root>
			<GroupedListContainer>
				<FlashList
					ref={listRef}
					onViewableItemsChanged={handleViewableItemsChanged}
					contentContainerStyle={{
						gap: 16
					}}
					onScroll={handleScroll}
					data={sections}
					renderItem={renderItem}
					getItemType={(item) => {
						return typeof item === 'string' ? 'sectionHeader' : 'row';
					}}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => (typeof item === 'string' ? item : (item as unknown as TransactionProps).id)}
					ItemSeparatorComponent={ItemSeparator}
					ListFooterComponent={<BottomSpacer $bottom={insets.bottom} />}
				/>
			</GroupedListContainer>
		</Root>
	);
};

export default Transactions;
