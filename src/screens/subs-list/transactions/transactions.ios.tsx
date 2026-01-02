import React from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { eq } from 'drizzle-orm';
import { db } from '@src/sql-migrations';
import { subscriptionsTable, currenciesTable, categoriesTable, servicesTable } from '@db/schema';

import { LegendList } from '@legendapp/list';
import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, GroupedListItem, BottomSpacer } from './transactions.styles';

import type { TransactionProps } from './transaction-card/transaction-card.d';
import type { LegendListRenderItemProps } from '@legendapp/list';

const renderItem = ({ item }: LegendListRenderItemProps<TransactionProps>) => (
	<GroupedListItem>
		<TransactionCard {...item} />
	</GroupedListItem>
);

const Transactions = () => {
	const insets = useSafeAreaInsets();

	const { data: transactions } = useLiveQuery(
		db
			.select()
			.from(subscriptionsTable)
			.leftJoin(currenciesTable, eq(subscriptionsTable.current_currency_id, currenciesTable.id))
			.leftJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.leftJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
	);

	return (
		<Root>
			<GroupedListContainer>
				<LegendList
					scrollEnabled
					data={transactions as TransactionProps[]}
					renderItem={renderItem}
					keyExtractor={(item) => `${item.subscriptions.id}${item?.categories?.id}${item?.services?.id}}`}
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
