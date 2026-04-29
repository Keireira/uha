import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { isHeaderSection } from './utils';
import { useDirectionStore } from '@models';
import { useAccent, useSettingsValue } from '@hooks';
import { regenerateAllTxs, backfillRates } from '@hooks/setup';
import { useTransactionsSections, useGetViewableItem } from './hooks';

import { RefreshControl } from 'react-native';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import { HeaderCard, TransactionCard } from './components';
import Root, { Gradient, Masked, ItemSeparator, BottomSpacer } from './txs-list.styles';

import type { HeaderSectionT, Props } from './txs-list.d';
import type { ListRenderItemInfo, FlashListRef } from '@shopify/flash-list';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { TransactionProps } from './components/transaction-card/transaction-card.d';

const renderRowItem = ({ item }: ListRenderItemInfo<HeaderSectionT | TransactionProps>) => {
	if (isHeaderSection(item)) {
		return <HeaderCard {...item} />;
	}

	return <TransactionCard {...item} />;
};

const TxsList = ({ transactions }: Props) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const accentColor = useAccent();
	const maxHorizon = useSettingsValue<number>('max_horizon');
	const listRef = useRef<FlashListRef<HeaderSectionT | TransactionProps>>(null);
	const isRefreshingRef = useRef(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const sections = useTransactionsSections(transactions);
	const handleViewableItemsChanged = useGetViewableItem();

	const handleScrollY = useDirectionStore((s) => s.handleScrollY);

	const onScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			handleScrollY(e.nativeEvent.contentOffset.y);
		},
		[handleScrollY]
	);

	const handleRefresh = useCallback(async () => {
		if (isRefreshingRef.current) return;

		isRefreshingRef.current = true;
		setIsRefreshing(true);

		try {
			const horizonYears = typeof maxHorizon === 'number' && Number.isFinite(maxHorizon) ? maxHorizon : 2;

			await regenerateAllTxs(horizonYears);
			await backfillRates({ refetchExisting: true });
		} catch {
			Toast.show({
				type: 'error',
				text1: t('rates.error.title'),
				text2: t('rates.error.description')
			});
		} finally {
			isRefreshingRef.current = false;
			setIsRefreshing(false);
		}
	}, [maxHorizon, t]);

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
					indicatorStyle={theme.tint === 'dark' ? 'white' : 'black'}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							tintColor={accentColor}
							colors={[accentColor]}
							progressViewOffset={8}
						/>
					}
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
