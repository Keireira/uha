import React, { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCalendar } from './hooks';
import { useScrollDirection } from '@hooks';
import { isHeaderSection, getItemType, keyExtractor } from './utils';

import { FlashList } from '@shopify/flash-list';
import Root, { BottomSpacer } from './year.styles';
import { HeaderRow, QuarterRow } from './components';

import type { Props, ItemT } from './year.d';
import type { ListRenderItemInfo, FlashListRef } from '@shopify/flash-list';

const renderQuarterRow = ({ item }: ListRenderItemInfo<ItemT>) => {
	if (isHeaderSection(item)) {
		return <HeaderRow {...item} />;
	}

	return <QuarterRow quarterMonths={item} />;
};

const Year = ({ transactions }: Props) => {
	const listRef = useRef<FlashListRef<ItemT>>(null);
	const insets = useSafeAreaInsets();
	const handleScroll = useScrollDirection();

	const calendarRows = useCalendar(transactions);

	return (
		<Root>
			<FlashList
				ref={listRef}
				contentContainerStyle={{ gap: 16 }}
				onScroll={handleScroll}
				data={calendarRows}
				getItemType={getItemType}
				keyExtractor={keyExtractor}
				renderItem={renderQuarterRow}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<BottomSpacer $height={insets.bottom} />}
			/>
		</Root>
	);
};

export default Year;
