import React from 'react';
import { useRouter } from 'expo-router';

import logos from '@assets/logos';
import { useSettingsValue, useRates } from '@hooks';

import { LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection, BottomText } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const TransactionCard = ({
	id,
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
	const { r, formatCurrency, hasAnyRate } = useRates(new Date(date), isPhantom, currency_code);
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');

	const withConversion = currency_code !== recalcCurrencyCode && hasAnyRate;
	const basePrice = price / (denominator || 1);
	const formattedBasePrice = formatCurrency(basePrice, currency_code);
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
						{formattedBasePrice}
					</LargeText>
				) : (
					<H3 numberOfLines={1} ellipsizeMode="tail" $weight={500} $align="right">
						{formattedBasePrice}
					</H3>
				)}

				{withConversion && (
					<BottomText numberOfLines={1} ellipsizeMode="tail" $align="right">
						{convertedPrice}
					</BottomText>
				)}
			</PriceSection>
		</Root>
	);
};

export default React.memo(TransactionCard);
