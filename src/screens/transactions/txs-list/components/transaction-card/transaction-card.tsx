import React from 'react';
import { useRouter } from 'expo-router';

import logos from '@assets/logos';
import { useSettingsValue, useRates } from '@hooks';

import { LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection, BottomText } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

/*
 * @TODO:
 * Apply real currency rates and conversion logic here
 */
const TransactionCard = ({
	id,
	currency,
	currency_code,
	price,
	denominator,
	slug,
	customName,
	title,
	emoji,
	category_title,
	color,
	date,
	isPhantom
}: TransactionProps) => {
	const router = useRouter();
	const { r } = useRates(new Date(date), isPhantom, currency_code);
	const showFractions = useSettingsValue<boolean>('currency_fractions');
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const withConversion = currency_code !== recalcCurrencyCode;
	const basePrice = price / (denominator || 1);
	const convertedPrice = r(basePrice);

	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	const openTransactionView = () => {
		router.push({
			pathname: '/(tabs)/transactions/[transactionId]',
			params: {
				transactionId: id
			}
		});
	};

	return (
		<Root onPress={openTransactionView}>
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
						{showFractions ? convertedPrice : Math.round(Number.parseInt(convertedPrice as string, 10))}
					</BottomText>
				)}
			</PriceSection>
		</Root>
	);
};

export default React.memo(TransactionCard);
