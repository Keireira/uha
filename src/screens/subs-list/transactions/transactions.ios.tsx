import React, { useRef, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { useScrollDirection } from '@hooks';
import { useTransactionsSections } from './hooks';

import { H4 } from '@ui';
import TransactionCard from './transaction-card';
import Root, { GroupedListContainer, ItemSeparator, BottomSpacer } from './transactions.styles';

import type { TransactionProps } from './transaction-card/transaction-card.d';

const renderItem = ({ item }: { item: string | TransactionProps }) => {
	if (typeof item === 'string') {
		return (
			<H4 $align="left" $weight={700} style={{ marginHorizontal: 16, marginTop: 16 }}>
				{item}
			</H4>
		);
	}

	return <TransactionCard {...(item as unknown as TransactionProps)} />;
};

// @TODO:
// - Move setViewableDate to separate store: feed
// - Add day's total amount if day_transactions.length > 1
const Transactions = () => {
	const listRef = useRef(null);
	const { scroll } = useAppModel();
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const sections = useTransactionsSections();

	const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
		if (viewableItems.length === 0) return;

		const possibleItem = viewableItems[1]?.item;
		const index = viewableItems[1] ? 1 : 0;

		let firstItem = possibleItem || viewableItems[index]?.item;
		if (typeof firstItem === 'string') {
			firstItem = viewableItems[index + 1]?.item;
		}

		if (firstItem) {
			const dates = new Date(firstItem.date);

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
