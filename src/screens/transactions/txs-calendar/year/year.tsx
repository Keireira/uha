import React, { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCalendar } from './hooks';
import { useScrollDirection } from '@hooks';
import { getItemType, keyExtractor, renderQuarterRow } from './utils';

import { FlashList } from '@shopify/flash-list';
import Root, { BottomSpacer } from './year.styles';

import type { Props } from './year.d';

const Year = ({ transactions }: Props) => {
	const listRef = useRef(null);
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
