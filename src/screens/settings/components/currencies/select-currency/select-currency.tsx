import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCurrencies } from './hooks';
import { isHeaderSection } from './utils';

import { FlashList } from '@shopify/flash-list';
import { View, useWindowDimensions } from 'react-native';
import { Header, SearchBar, CurrencyRow } from './components';
import Root, { Content, VerticalSpacer, SectionHeaderText } from './select-currency.styles';

import type { RowItem } from './select-currency.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const renderRowItem = ({ item }: ListRenderItemInfo<RowItem>) => {
	if (isHeaderSection(item)) {
		return <SectionHeaderText>{item.title}</SectionHeaderText>;
	}

	const { key, ...rest } = item.item;

	return <CurrencyRow {...rest} isLast={item.isLast} />;
};

const SelectCurrencyScreen = () => {
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const { sections, searchQuery, setSearchQuery } = useCurrencies();

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
							showsVerticalScrollIndicator={false}
							getItemType={(item) => item.type}
							keyExtractor={(item) => (isHeaderSection(item) ? `s-${item.title}` : item.item.key)}
							ListHeaderComponent={<VerticalSpacer $height={insets.top} />}
							ListFooterComponent={<VerticalSpacer $height={insets.bottom + 64} />}
						/>
					</View>
				</Content>
			</Root>

			<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
		</>
	);
};

export default SelectCurrencyScreen;
