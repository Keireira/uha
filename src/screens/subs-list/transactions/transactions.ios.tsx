import React from 'react';
import { FlatList } from 'react-native';
import { useUnit } from 'effector-react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { useScrollDirection } from '@hooks';
import { eq, desc } from 'drizzle-orm';
import {
	transactionsTable,
	currenciesTable,
	servicesTable,
	subscriptionsTable,
	categoriesTable,
	tendersTable
} from '@db/schema';
import { buildWhereConditions } from './utils';

import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, BottomSpacer } from './transactions.styles';

import type { ListRenderItem } from 'react-native';
import type { TransactionProps } from './transaction-card/transaction-card.d';

const renderItem: ListRenderItem<TransactionProps> = ({ item }) => <TransactionCard {...item} />;

const Transactions = () => {
	const insets = useSafeAreaInsets();
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);
	const handleScroll = useScrollDirection();

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
			.orderBy(desc(transactionsTable.date))
			.where(buildWhereConditions(lensesStore.filters, lensesStore.time_mode)),
		[lensesStore.filters, lensesStore.time_mode]
	);

	return (
		<Root>
			<GroupedListContainer>
				<FlatList
					contentContainerStyle={{
						gap: 16
					}}
					style={{
						paddingHorizontal: 12
					}}
					onScroll={handleScroll}
					data={transactions as TransactionProps[]}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					ListFooterComponent={<BottomSpacer $bottom={insets.bottom} />}
				/>
			</GroupedListContainer>
		</Root>
	);
};

export default Transactions;
