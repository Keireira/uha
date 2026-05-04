import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';

import { useCurrencies } from './hooks';
import { useEntitlement } from '@hooks';
import { isHeaderSection } from './utils';

import { FlashList } from '@shopify/flash-list';
import { Header, SearchBar, CurrencyRow, NoFilters } from './components';
import Root, { Content, SectionHeaderText } from './select-currency.styles';

import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { RowItem, SearchParamsT } from './select-currency.d';

const renderRowItem = ({ item, extraData }: ListRenderItemInfo<RowItem>) => {
	if (isHeaderSection(item)) {
		return <SectionHeaderText>{item.title}</SectionHeaderText>;
	}

	const { key, ...rest } = item.item;
	const { freeCurrencies, isAllowed } = extraData;
	const isForbidden = isAllowed ? false : !freeCurrencies.includes(rest.code);

	return <CurrencyRow {...rest} isLast={item.isLast} isForbidden={isForbidden} />;
};

const useIsAllowed = () => {
	const { tier } = useEntitlement();
	const { target } = useLocalSearchParams<SearchParamsT>();

	return ['settings_recalc_currency'].includes(target) ? tier.allCurrencies : true;
};

const SelectCurrencyScreen = () => {
	const isAllowed = useIsAllowed();
	const headerHeight = useHeaderHeight();
	const { sections, freeCurrencies, setSearchQuery } = useCurrencies();

	return (
		<>
			<Root>
				<Header />

				<Content>
					<FlashList
						contentContainerStyle={{
							paddingTop: headerHeight,
							paddingBottom: 84,
							gap: 16
						}}
						data={sections}
						renderItem={renderRowItem}
						keyboardShouldPersistTaps="handled"
						extraData={{
							freeCurrencies,
							isAllowed
						}}
						ListEmptyComponent={NoFilters}
						showsVerticalScrollIndicator={false}
						getItemType={(item) => item.type}
						keyExtractor={(item) => (isHeaderSection(item) ? `s-${item.title}` : item.item.key)}
					/>
				</Content>
			</Root>

			<SearchBar setSearchQuery={setSearchQuery} />
		</>
	);
};

export default SelectCurrencyScreen;
