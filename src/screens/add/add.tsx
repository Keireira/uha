import React, { useCallback, useEffect } from 'react';
import { useSettingsValue } from '@hooks';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import SearchResults from './search-results';
import useSearch from './use-search';
import { searchCallbackRef } from './search-callback';
import Root, { ScreenTitle, Grid, CardGlass, CardInner } from './add.styles';

import type { AccentT } from '@themes';

const ITEMS = [
	{
		route: '/add-category',
		icon: 'square.grid.2x2',
		title: 'Category',
		description: 'Group services by type'
	},
	{
		route: '/add-service',
		icon: 'building.2',
		title: 'Service',
		description: 'A vendor or provider'
	},
	{
		route: '/add-payment',
		icon: 'creditcard',
		title: 'Payment',
		description: 'Card or payment method'
	},
	{
		route: '/add-subscription',
		icon: 'arrow.triangle.2.circlepath',
		title: 'Subscription',
		description: 'Recurring charge'
	}
] as const;

const AddCrossroad = () => {
	const theme = useTheme();
	const router = useRouter();
	const navigation = useNavigation();
	const settingAccent = useSettingsValue<AccentT>('accent');
	const { query, search, results, loading } = useSearch();

	useEffect(() => {
		searchCallbackRef.current = search;
		return () => {
			searchCallbackRef.current = () => {};
		};
	}, [search]);

	// Re-trigger autoFocus on every tab focus (iOS doesn't re-trigger on tab switch)
	useFocusEffect(
		useCallback(() => {
			const timer = setTimeout(() => {
				navigation.setOptions({
					headerSearchBarOptions: {
						placeholder: 'Search service to add',
						autoFocus: true,
						onChangeText: (e: { nativeEvent: { text: string } }) => searchCallbackRef.current(e.nativeEvent.text),
						onCancelButtonPress: () => searchCallbackRef.current('')
					}
				});
			}, 50);

			return () => clearTimeout(timer);
		}, [navigation])
	);

	const isSearching = query.trim().length > 0;

	return (
		<Root>
			{isSearching ? (
				<SearchResults results={results} loading={loading} query={query} />
			) : (
				<>
					<ScreenTitle>New entry</ScreenTitle>

					<Grid>
						{ITEMS.map((item) => (
							<CardGlass key={item.route} isInteractive>
								<CardInner onPress={() => router.push(item.route)}>
									<SymbolView name={item.icon} size={24} tintColor={settingAccent} />
									<H5>{item.title}</H5>
									<SmallText $color={theme.text.secondary}>{item.description}</SmallText>
								</CardInner>
							</CardGlass>
						))}
					</Grid>
				</>
			)}
		</Root>
	);
};

export default AddCrossroad;
