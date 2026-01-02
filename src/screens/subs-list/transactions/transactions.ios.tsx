import React from 'react';
import { useUnit } from 'effector-react';
import { FlashList } from '@shopify/flash-list';
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
import Root, { GroupedListContainer, ItemSeparator, BottomSpacer } from './transactions.styles';

import type { TransactionProps } from './transaction-card/transaction-card.d';

const renderItem = ({ item }: { item: TransactionProps }) => <TransactionCard {...item} />;

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
				<FlashList
					contentContainerStyle={{
						gap: 8
					}}
					onScroll={handleScroll}
					data={transactions as TransactionProps[]}
					renderItem={renderItem}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					ItemSeparatorComponent={ItemSeparator}
					ListFooterComponent={<BottomSpacer $bottom={insets.bottom} />}
				/>
			</GroupedListContainer>
		</Root>
	);
};

export default Transactions;
