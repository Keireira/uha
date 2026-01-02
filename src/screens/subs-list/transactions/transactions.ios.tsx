import React from 'react';
import { useUnit } from 'effector-react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { db } from '@src/sql-migrations';
import { eq, and, inArray, desc, gte } from 'drizzle-orm';
import { transactionsTable, currenciesTable, servicesTable, subscriptionsTable, categoriesTable } from '@db/schema';

import { LegendList } from '@legendapp/list';
import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, GroupedListItem, BottomSpacer } from './transactions.styles';

import type { AppliedFilterT, TimeModesT } from '@models/app-model.d';
import type { LegendListRenderItemProps } from '@legendapp/list';
import type { TransactionProps } from './transaction-card/transaction-card.d';

const renderItem = ({ item }: LegendListRenderItemProps<TransactionProps>) => (
	<GroupedListItem>
		<TransactionCard {...item} />
	</GroupedListItem>
);

const buildWhereConditions = (filters: AppliedFilterT[], timeMode: TimeModesT) => {
	const conditions = [];

	const categoryFilters = filters.filter((f) => f.type === 'category').map((f) => f.value);
	if (categoryFilters.length > 0) {
		conditions.push(inArray(categoriesTable.id, categoryFilters));
	}

	const serviceFilters = filters.filter((f) => f.type === 'service').map((f) => f.value);
	if (serviceFilters.length > 0) {
		conditions.push(inArray(servicesTable.id, serviceFilters));
	}

	const currencyFilters = filters.filter((f) => f.type === 'currency').map((f) => f.value);
	if (currencyFilters.length > 0) {
		conditions.push(inArray(currenciesTable.id, currencyFilters));
	}

	if (timeMode === 'future') {
		conditions.push(gte(transactionsTable.date, new Date().toISOString()));
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
};

const Transactions = () => {
	const insets = useSafeAreaInsets();
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
			.orderBy(desc(transactionsTable.date))
			.where(buildWhereConditions(lensesStore.filters, lensesStore.time_mode)),
		[lensesStore]
	);

	console.log(transactions.length);

	return (
		<Root>
			<GroupedListContainer>
				<LegendList
					scrollEnabled
					data={transactions as TransactionProps[]}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					recycleItems
					estimatedItemSize={60}
					waitForInitialLayout
					drawDistance={500}
					ListFooterComponent={<BottomSpacer $bottom={insets.bottom} />}
					columnWrapperStyle={{
						gap: 16
					}}
				/>
			</GroupedListContainer>
		</Root>
	);
};

export default Transactions;
