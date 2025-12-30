import React from 'react';
import { Settings } from 'react-native';

import logos from '@assets/logos';

import { SmallText, LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const TransactionCard = ({ subscriptions, currencies, services, categories }: TransactionProps) => {
	const showConverted = randomInt(0, 1);
	const showFractions = Settings.get('currency_fractions') === 1 ? true : false;

	const convertedPrice = (subscriptions.current_price * 514.1) / currencies.denominator;
	const basePrice = subscriptions.current_price / currencies.denominator;

	const withConversion = showConverted > 0;

	const logoUrl = services.slug ? logos[services.slug as keyof typeof logos] : null;

	return (
		<Root>
			<LogoSection>
				<LogoView
					logoId={logoUrl}
					emoji={categories?.emoji}
					name={subscriptions.custom_name || services.title}
					size={48}
					color={services.color || categories?.color}
				/>
			</LogoSection>

			<DescSection>
				<H3 numberOfLines={1} ellipsizeMode="tail">
					{subscriptions.custom_name || services.title}
				</H3>

				<SmallText numberOfLines={1} ellipsizeMode="tail" $color="#666">
					{categories?.title}
				</SmallText>
			</DescSection>

			<PriceSection $isSingle={!withConversion}>
				{withConversion ? (
					<LargeText $weight={500} $align="right">
						{currencies.symbol}
						{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
					</LargeText>
				) : (
					<H3 $weight={500} $align="right">
						{currencies.symbol}
						{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
					</H3>
				)}

				{withConversion && (
					<SmallText $align="right" $color="#666">
						{showFractions ? convertedPrice.toFixed(2) : Math.round(convertedPrice)} ₸
					</SmallText>
				)}
			</PriceSection>
		</Root>
	);
};

export default TransactionCard;
