import React from 'react';

import logos from '@assets/logos';
import { useSettingsValue } from '@hooks';

import { Text, LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const STUB_KZT_RATE = 514.1;

const randomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
 * @TODO:
 * Apply real currency rates and conversion logic here
 */
const TransactionCard = ({
	currency,
	price,
	denominator,
	slug,
	customName,
	title,
	emoji,
	category_title,
	color
}: TransactionProps) => {
	const showConverted = randomInt(0, 1);
	const showFractions = useSettingsValue<boolean>('currency_fractions');

	const convertedPrice = (price * STUB_KZT_RATE) / (denominator || 1);
	const basePrice = price / (denominator || 1);

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

				<Text numberOfLines={1} ellipsizeMode="tail" $color="#666">
					{category_title}
				</Text>
			</DescSection>

			<PriceSection $isSingle={!withConversion}>
				{withConversion ? (
					<LargeText numberOfLines={1} ellipsizeMode="tail" $weight={500} $align="right">
						{currency}
						{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
					</LargeText>
				) : (
					<H3 numberOfLines={1} ellipsizeMode="tail" $weight={500} $align="right">
						{currency}
						{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
					</H3>
				)}

				{withConversion && (
					<Text numberOfLines={1} ellipsizeMode="tail" $align="right" $color="#666">
						{showFractions ? convertedPrice.toFixed(2) : Math.round(convertedPrice)} ₸
					</Text>
				)}
			</PriceSection>
		</Root>
	);
};

export default React.memo(TransactionCard);
