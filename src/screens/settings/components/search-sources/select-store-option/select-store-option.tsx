import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStoreOptions } from './hooks';
import { useEntitlement } from '@hooks';
import { isHeaderSection } from './utils';

import { FlashList } from '@shopify/flash-list';
import { View, useWindowDimensions } from 'react-native';
import { Header, SearchBar, OptionRow } from './components';
import Root, { Content, VerticalSpacer, SectionHeaderText } from './select-store-option.styles';

import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { SearchParamsT, RowItem } from './select-store-option.d';

const renderRowItem = ({ item, extraData }: ListRenderItemInfo<RowItem>) => {
	if (isHeaderSection(item)) {
		return <SectionHeaderText>{item.title}</SectionHeaderText>;
	}

	const { key, ...rest } = item.item;
	const { freeCodes, isAllowed } = extraData;
	const isForbidden = isAllowed ? false : !freeCodes.includes(rest.code);

	return <OptionRow {...rest} isLast={item.isLast} isForbidden={isForbidden} />;
};

const SelectStoreOptionScreen = () => {
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const { tier } = useEntitlement();
	const { sections, freeCodes, searchQuery, setSearchQuery } = useStoreOptions();
	const isAllowed = target.endsWith('_country') ? tier.allRegions : tier.allLanguages;

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
							extraData={{ freeCodes, isAllowed }}
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

export default SelectStoreOptionScreen;
