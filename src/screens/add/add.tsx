import React from 'react';
import { useRouter } from 'expo-router';
import { useSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import SearchResults from './search-results';
import useSearch from './use-search';
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
	const { query, results, isLoading } = useSearch();
	const settingAccent = useSettingsValue<AccentT>('accent');

	const isSearching = query.trim().length > 1 || isLoading;

	return (
		<Root>
			{isSearching ? (
				<SearchResults results={results} loading={isLoading} query={query} />
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
