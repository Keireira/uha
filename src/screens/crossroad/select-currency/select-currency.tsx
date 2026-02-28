import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import { FlashList } from '@shopify/flash-list';
import { SymbolView } from 'expo-symbols';
import { TextInput, CircleButton } from '@ui';
import { setSettingsValue, useSettingsValue } from '@hooks';
import useCurrencies from './use-currencies';

import {
	Container,
	Header,
	Title,
	SearchContainer,
	SectionHeaderText,
	CurrencyRow,
	CurrencyInfo,
	CurrencyName,
	CurrencyCode,
	Separator
} from './select-currency.styles';

import type { CurrencyItem } from './use-currencies';

type FlatItem = { type: 'section'; title: string } | { type: 'currency'; item: CurrencyItem; isLast: boolean };

const SelectCurrencyScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { target } = useLocalSearchParams<{ target: string }>();

	const currentValue = useSettingsValue<string>(target || 'default_currency_code');
	const [searchQuery, setSearchQuery] = useState('');

	const sections = useCurrencies(searchQuery);

	const flatData = useMemo(() => {
		const items: FlatItem[] = [];
		const stickyIndices: number[] = [];

		for (const section of sections) {
			stickyIndices.push(items.length);
			items.push({ type: 'section', title: section.title });

			for (let i = 0; i < section.data.length; i++) {
				items.push({
					type: 'currency',
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

	const handleClear = useCallback(() => {
		setSearchQuery('');
	}, []);

	const renderItem = useCallback(
		({ item }: { item: FlatItem }) => {
			if (item.type === 'section') {
				return <SectionHeaderText>{item.title}</SectionHeaderText>;
			}

			const { item: currency, isLast } = item;
			const isSelected = currency.code === currentValue;

			return (
				<>
					<CurrencyRow onPress={() => handleSelect(currency.code)}>
						{isSelected ? (
							<SymbolView name="checkmark.circle.fill" size={24} tintColor={theme.accent.orange} />
						) : (
							<SymbolView name="circle" size={24} tintColor={`${theme.text.secondary}40`} />
						)}

						<CurrencyInfo>
							<CurrencyName>{currency.name}</CurrencyName>
							<CurrencyCode>{currency.code}</CurrencyCode>
						</CurrencyInfo>
					</CurrencyRow>

					{!isLast && <Separator />}
				</>
			);
		},
		[currentValue, handleSelect, theme]
	);

	const getItemType = useCallback((item: FlatItem) => item.type, []);

	return (
		<Container style={{ paddingTop: insets.top }}>
			<Header>
				<Title>{t('settings.currencies.select_title')}</Title>

				<CircleButton systemImage="xmark" onPress={() => router.back()} />
			</Header>

			<SearchContainer>
				<TextInput
					leadingIcon="search"
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={handleClear}
					placeholder={t('settings.currencies.search')}
				/>
			</SearchContainer>

			<FlashList
				data={flatData.items}
				renderItem={renderItem}
				stickyHeaderIndices={flatData.stickyIndices}
				keyExtractor={(item) => (item.type === 'section' ? `s-${item.title}` : `c-${item.item.code}`)}
				getItemType={getItemType}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
			/>
		</Container>
	);
};

export default SelectCurrencyScreen;
