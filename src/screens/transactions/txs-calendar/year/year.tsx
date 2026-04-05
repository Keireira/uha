import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCalendar } from './hooks';
import { useSettingsValue } from '@hooks';
import { useTxDatesStore } from '@screens/transactions/models';
import { isHeaderSection, getItemType, keyExtractor } from './utils';

import { FlashList } from '@shopify/flash-list';
import Root, { BottomSpacer } from './year.styles';
import { HeaderRow, QuarterRow } from './components';

import type { UserT } from '@models';
import type { Props, ItemT } from './year.d';
import type { ListRenderItemInfo, FlashListRef } from '@shopify/flash-list';

const Year = ({ transactions }: Props) => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const listRef = useRef<FlashListRef<ItemT>>(null);
	const firstDay = useSettingsValue<UserT['first_day']>('first_day');

	const calendarRows = useCalendar(transactions);
	const selectedDate = useTxDatesStore((store) => store.selectedDate);
	const setActiveMonth = useTxDatesStore((store) => store.setActiveMonth);

	const onPressMonth = (monthDate: Date) => {
		setActiveMonth(monthDate);

		router.setParams({
			calendar_scale: 'month'
		});
	};

	const renderQuarterRow = ({ item }: ListRenderItemInfo<ItemT>) => {
		if (isHeaderSection(item)) {
			return <HeaderRow {...item} />;
		}

		return (
			<QuarterRow
				quarterMonths={item}
				selectedDate={selectedDate}
				onPressMonth={onPressMonth}
				weekStartsOn={firstDay === 'monday' ? 1 : 0}
			/>
		);
	};

	return (
		<Root>
			<FlashList
				ref={listRef}
				contentContainerStyle={{ gap: 16 }}
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
