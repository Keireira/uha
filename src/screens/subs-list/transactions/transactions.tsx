import React, { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isHeaderSection } from './utils';
import { useScrollDirection } from '@hooks';
import useTransactions from '@hooks/use-transactions';
import { useTransactionsSections, useGetViewableItem } from './hooks';

import HeaderCard from './header-card';
import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, ItemSeparator, BottomSpacer } from './transactions.styles';

import type { HeaderSectionT } from './transactions.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { TransactionProps } from './transaction-card/transaction-card.d';

const renderRowItem = ({ item }: ListRenderItemInfo<HeaderSectionT | TransactionProps>) => {
	if (isHeaderSection(item)) {
		return <HeaderCard {...item} />;
	}

	return <TransactionCard {...item} />;
};

const Transactions = () => {
	const listRef = useRef(null);
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const testTxs = useTransactions();

	// return null;

	// const sections = useTransactionsSections();
	const handleViewableItemsChanged = useGetViewableItem();

	return (
		<Root>
			<GroupedListContainer>
				<FlashList
					ref={listRef}
					contentContainerStyle={{
						gap: 16
					}}
					// data={sections}
					data={testTxs}
					onScroll={handleScroll}
					renderItem={renderRowItem}
					showsVerticalScrollIndicator={false}
					onViewableItemsChanged={handleViewableItemsChanged}
					getItemType={(item) => (isHeaderSection(item) ? 'sectionHeader' : 'row')}
					keyExtractor={(item) => (isHeaderSection(item) ? item.date : item.id)}
					ItemSeparatorComponent={ItemSeparator}
					ListFooterComponent={<BottomSpacer $height={insets.bottom} />}
				/>
			</GroupedListContainer>
		</Root>
	);
};

export default Transactions;
