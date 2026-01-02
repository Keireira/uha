import React from 'react';
import { Settings } from 'react-native';

import logos from '@assets/logos';

import { SmallText, LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const TransactionCard = ({
	currency,
	price,
	denominator,
	slug,
	customName,
	title,
	emoji,
	category,
	color
}: TransactionProps) => {
	const showConverted = randomInt(0, 1);
	const showFractions = Settings.get('currency_fractions') === 1 ? true : false;

	const convertedPrice = (price * 514.1) / denominator;
	const basePrice = price / denominator;

	const withConversion = showConverted > 0;

	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	return (
		<Root>
			<LogoSection>
				<LogoView logoId={logoUrl} emoji={emoji} name={customName || title} size={48} color={color} />
			</LogoSection>

			<DescSection>
				<H3 numberOfLines={1} ellipsizeMode="tail">
					{customName || title}
				</H3>

				<SmallText numberOfLines={1} ellipsizeMode="tail" $color="#666">
					{category}
				</SmallText>
			</DescSection>

			<PriceSection $isSingle={!withConversion}>
				{withConversion ? (
					<LargeText $weight={500} $align="right">
						{currency}
						{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
					</LargeText>
				) : (
					<H3 $weight={500} $align="right">
						{currency}
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
