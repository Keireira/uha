import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCurrencies } from './hooks';
import { useEntitlement } from '@hooks';
import { isHeaderSection } from './utils';

import { FlashList } from '@shopify/flash-list';
import { View, useWindowDimensions } from 'react-native';
import { Header, SearchBar, CurrencyRow, NoFilters } from './components';
import Root, { Content, VerticalSpacer, SectionHeaderText } from './select-currency.styles';

import type { RowItem } from './select-currency.d';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const renderRowItem = ({ item, extraData }: ListRenderItemInfo<RowItem>) => {
	if (isHeaderSection(item)) {
		return <SectionHeaderText>{item.title}</SectionHeaderText>;
	}

	const { key, ...rest } = item.item;
	const { freeCurrencies, isAllowed } = extraData;
	const isForbidden = isAllowed ? false : !freeCurrencies.includes(rest.code);

	return <CurrencyRow {...rest} isLast={item.isLast} isForbidden={isForbidden} />;
};

const SelectCurrencyScreen = () => {
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const { tier } = useEntitlement();
	const { sections, freeCurrencies, setSearchQuery } = useCurrencies();

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
							extraData={{
								freeCurrencies,
								isAllowed: tier.allCurrencies
							}}
							ListEmptyComponent={NoFilters}
							showsVerticalScrollIndicator={false}
							getItemType={(item) => item.type}
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

export default SelectCurrencyScreen;
