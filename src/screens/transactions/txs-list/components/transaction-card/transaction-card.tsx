import React from 'react';

import { randomInt } from '@lib';
import logos from '@assets/logos';
import { useSettingsValue } from '@hooks';

import { LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection, BottomText } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const STUB_KZT_RATE = 514.1;

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

				<BottomText numberOfLines={1} ellipsizeMode="tail">
					{category_title}
				</BottomText>
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
					<BottomText numberOfLines={1} ellipsizeMode="tail" $align="right">
						{showFractions ? convertedPrice.toFixed(2) : Math.round(convertedPrice)} ₸
					</BottomText>
				)}
			</PriceSection>
		</Root>
	);
};

export default React.memo(TransactionCard);
