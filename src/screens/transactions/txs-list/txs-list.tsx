import React, { useCallback, useRef } from 'react';

import { useDirectionStore } from '@models';
import { isHeaderSection } from './utils';
import { useTheme } from 'styled-components/native';
import { useTransactionsSections, useGetViewableItem } from './hooks';

import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import { HeaderCard, TransactionCard } from './components';
import Root, { Gradient, Masked, ItemSeparator, BottomSpacer } from './txs-list.styles';

import type { HeaderSectionT, Props } from './txs-list.d';
import type { ListRenderItemInfo, FlashListRef } from '@shopify/flash-list';
import type { TransactionProps } from './components/transaction-card/transaction-card.d';

const renderRowItem = ({ item }: ListRenderItemInfo<HeaderSectionT | TransactionProps>) => {
	if (isHeaderSection(item)) {
		return <HeaderCard {...item} />;
	}

	return <TransactionCard {...item} />;
};

const TxsList = ({ transactions }: Props) => {
	const theme = useTheme();
	const listRef = useRef<FlashListRef<HeaderSectionT | TransactionProps>>(null);

	const sections = useTransactionsSections(transactions);
	const handleViewableItemsChanged = useGetViewableItem();

	const handleScrollY = useDirectionStore((s) => s.handleScrollY);

	const onScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			handleScrollY(e.nativeEvent.contentOffset.y);
		},
		[handleScrollY]
	);

	return (
		<Masked
			maskElement={
				<Gradient
					colors={['transparent', 'black', 'black']}
					locations={[0, 0.03, 1]}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				/>
			}
		>
			<Root>
				<FlashList
					ref={listRef}
					onScroll={onScroll}
					scrollEventThrottle={16}
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={{
						gap: 16,
						paddingLeft: 12,
						paddingRight: 8,
						backgroundColor: theme.background.default
					}}
					data={sections}
					renderItem={renderRowItem}
					showsVerticalScrollIndicator={false}
					onViewableItemsChanged={handleViewableItemsChanged}
					getItemType={(item) => (isHeaderSection(item) ? 'sectionHeader' : 'row')}
					keyExtractor={(item) => (isHeaderSection(item) ? item.date : item.id)}
					ItemSeparatorComponent={ItemSeparator}
					ListFooterComponent={<BottomSpacer />}
				/>
			</Root>
		</Masked>
	);
};

export default TxsList;
