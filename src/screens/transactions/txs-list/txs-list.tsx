import React, { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppModel } from '@models';
import { isHeaderSection } from './utils';
import { useScrollDirection } from '@hooks';
import { useTransactionsSections, useGetViewableItem } from './hooks';

import { LinearGradient } from 'expo-linear-gradient';
import { HeaderCard, TransactionCard } from './components';
import Root, { Masked, GroupedListContainer, ItemSeparator, BottomSpacer } from './txs-list.styles';

import type { HeaderSectionT } from './txs-list.d';
import type { ListRenderItemInfo, FlashListRef } from '@shopify/flash-list';
import type { TransactionProps } from './components/transaction-card/transaction-card.d';

const renderRowItem = ({ item }: ListRenderItemInfo<HeaderSectionT | TransactionProps>) => {
	if (isHeaderSection(item)) {
		return <HeaderCard {...item} />;
	}

	return <TransactionCard {...item} />;
};

const TxsList = () => {
	const listRef = useRef<FlashListRef<HeaderSectionT | TransactionProps>>(null);
	const insets = useSafeAreaInsets();
	const { view_mode } = useAppModel();
	const handleScroll = useScrollDirection();

	const sections = useTransactionsSections();
	const handleViewableItemsChanged = useGetViewableItem();

	React.useEffect(() => {
		const unsubscribe = view_mode.list.scrollToTop.watch(() => {
			listRef.current?.scrollToOffset({ offset: 0, animated: true });
		});

		return () => unsubscribe();
	}, [view_mode.list.scrollToTop]);

	return (
		<Masked
			maskElement={
				<LinearGradient
					colors={['transparent', 'black', 'black']}
					locations={[0, 0.03, 1]}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={{ flex: 1 }}
				/>
			}
		>
			<Root>
				<GroupedListContainer>
					<FlashList
						ref={listRef}
						contentContainerStyle={{
							gap: 16
						}}
						data={sections}
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
		</Masked>
	);
};

export default TxsList;
