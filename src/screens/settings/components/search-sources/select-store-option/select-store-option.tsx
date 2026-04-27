import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStoreOptions } from './hooks';
import { isHeaderSection } from './utils';

import { FlashList } from '@shopify/flash-list';
import { View, useWindowDimensions } from 'react-native';
import { Header, SearchBar, OptionRow, NoFilters } from './components';
import Root, { Content, VerticalSpacer, SectionHeaderText } from './select-store-option.styles';

import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { RowItem } from './select-store-option.d';

const renderRowItem = ({ item }: ListRenderItemInfo<RowItem>) => {
	if (isHeaderSection(item)) {
		return <SectionHeaderText>{item.title}</SectionHeaderText>;
	}

	const { key, ...rest } = item.item;

	return <OptionRow {...rest} isLast={item.isLast} />;
};

const SelectStoreOptionScreen = () => {
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const { sections, setSearchQuery } = useStoreOptions();

	return (
		<>
			<Root>
				<Header />

				<Content>
					<View style={{ height: dimensions.height + 64 }}>
						<FlashList
							contentContainerStyle={{ gap: 16 }}
							data={sections}
							renderItem={renderRowItem}
							keyboardShouldPersistTaps="handled"
							contentInsetAdjustmentBehavior="automatic"
							showsVerticalScrollIndicator={false}
							getItemType={(item) => item.type}
							ListEmptyComponent={NoFilters}
							keyExtractor={(item) => (isHeaderSection(item) ? `s-${item.title}` : item.item.key)}
							ListFooterComponent={<VerticalSpacer $height={insets.bottom} />}
						/>
					</View>
				</Content>
			</Root>

			<SearchBar setSearchQuery={setSearchQuery} />
		</>
	);
};

export default SelectStoreOptionScreen;
