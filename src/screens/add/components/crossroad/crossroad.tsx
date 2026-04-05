import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { useSettingsValue } from '@hooks';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { ScreenTitle, CardGlass, CardInner } from './crossroad.styles';

import type { AccentT } from '@themes';

const ITEMS = [
	{
		route: '/add-category',
		icon: 'square.grid.2x2',
		slug: 'category',
		title: 'Category',
		description: 'Group services by type'
	},
	{
		route: '/add-service',
		icon: 'building.2',
		slug: 'service',
		title: 'Service',
		description: 'A vendor or provider'
	},
	{
		route: '/add-payment',
		icon: 'creditcard',
		slug: 'payment',
		title: 'Payment',
		description: 'Card or payment method'
	},
	{
		route: '/add-subscription',
		icon: 'arrow.triangle.2.circlepath',
		slug: 'subscription',
		title: 'Subscription',
		description: 'Recurring charge'
	}
] as const;

const Crossroad = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useSettingsValue<AccentT>('accent');

	return (
		<>
			<ScreenTitle>New entry</ScreenTitle>

			<Root>
				{ITEMS.map((item) => (
					<CardGlass key={item.route} isInteractive>
						<CardInner onPress={() => router.push(item.route)}>
							<SymbolView name={item.icon} size={24} tintColor={settingAccent} />
							<H5>{item.title}</H5>
							<SmallText $color={theme.text.secondary}>{item.description}</SmallText>
						</CardInner>
					</CardGlass>
				))}
			</Root>
		</>
	);
};

export default Crossroad;
