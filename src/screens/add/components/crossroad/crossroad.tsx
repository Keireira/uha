import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import { H5, SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { ScreenTitle, CardGlass, CardInner } from './crossroad.styles';

const ITEMS = [
	{
		route: '/add-category',
		icon: 'square.grid.2x2',
		slug: 'category'
	},
	{
		route: '/add-service',
		icon: 'building.2',
		slug: 'service'
	},
	{
		route: '/add-payment',
		icon: 'creditcard',
		slug: 'payment'
	},
	{
		route: '/add-subscription',
		icon: 'arrow.triangle.2.circlepath',
		slug: 'subscription'
	}
] as const;

const Crossroad = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	return (
		<>
			<ScreenTitle>New entry</ScreenTitle>

			<Root>
				{ITEMS.map((item) => {
					const goTo = () => router.push(item.route);

					return (
						<CardGlass key={item.route} isInteractive>
							<CardInner onPress={goTo}>
								<SymbolView name={item.icon} size={24} tintColor={settingAccent} />
								<H5>{t(`crossroad.grid.${item.slug}.title`)}</H5>
								<SmallText $color={theme.text.secondary}>{t(`crossroad.grid.${item.slug}.description`)}</SmallText>
							</CardInner>
						</CardGlass>
					);
				})}
			</Root>
		</>
	);
};

export default Crossroad;
