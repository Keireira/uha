import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { FlashList } from '@shopify/flash-list';
import { setSettingsValue, useSettingsValue } from '@hooks';
import useCurrencies from './use-currencies';

import Root, {
	Content,
	VerticalSpacer,
	SectionHeaderText,
	CurrencyRow,
	CurrencyInfo,
	CurrencyName,
	CurrencyCode,
	Separator
} from './select-currency.styles';
import { View, useWindowDimensions } from 'react-native';
import { Header, SearchBar } from './components';

import type { CurrencyItem } from './use-currencies';

type FlatItem = { type: 'sectionHeader'; title: string } | { type: 'row'; item: CurrencyItem; isLast: boolean };

const SelectCurrencyScreen = () => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const { target } = useLocalSearchParams<{ target: string }>();

	const currentValue = useSettingsValue<string>(target || 'default_currency_code');
	const [searchQuery, setSearchQuery] = useState('');

	const sections = useCurrencies(searchQuery);

	const flatData = useMemo(() => {
		const items: FlatItem[] = [];
		const stickyIndices: number[] = [];

		for (const section of sections) {
			stickyIndices.push(items.length);
			items.push({ type: 'sectionHeader', title: section.title });

			for (let i = 0; i < section.data.length; i++) {
				items.push({
					type: 'row',
					item: section.data[i],
					isLast: i === section.data.length - 1
				});
			}
		}

		return { items, stickyIndices };
	}, [sections]);

	const handleSelect = useCallback(
		(code: string) => {
			if (!target) return;

			setSettingsValue(target, code);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			router.back();
		},
		[target, router]
	);

	const renderItem = useCallback(
		({ item }: { item: FlatItem }) => {
			if (item.type === 'sectionHeader') {
				return <SectionHeaderText>{item.title}</SectionHeaderText>;
			}

			const { item: currency, isLast } = item;

			return (
				<>
					<CurrencyRow onPress={() => handleSelect(currency.code)}>
						<CurrencyInfo>
							<CurrencyName $isSelected={currentValue === currency.code}>{currency.name}</CurrencyName>
							<CurrencyCode>{currency.code}</CurrencyCode>
						</CurrencyInfo>
					</CurrencyRow>

					{!isLast && <Separator />}
				</>
			);
		},
		[handleSelect, currentValue]
	);

	const getItemType = useCallback((item: FlatItem) => item.type, []);

	return (
		<>
			<Root>
				<Header />

				<Content>
					<View style={{ height: dimensions.height + 64 }}>
						<FlashList
							data={flatData.items}
							renderItem={renderItem}
							contentContainerStyle={{ gap: 16 }}
							keyExtractor={(item) => (item.type === 'sectionHeader' ? `s-${item.title}` : item.item.key)}
							getItemType={getItemType}
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
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
