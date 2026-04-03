import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFormattedPrice } from '@hooks/rates';

import { LargeText, H3, LogoView } from '@ui';
import Root, { LogoSection, DescSection, PriceSection, BottomText } from './transaction-card.styles';

import type { TransactionProps } from './transaction-card.d';

const TransactionCard = ({
	id,
	currency_code,
	category_slug,
	category_title,
	price,
	slug,
	customName,
	title,
	emoji,
	color,
	date
}: TransactionProps) => {
	const router = useRouter();
	const { t } = useTranslation();
	const { withConversion, basePrice, convertedPrice } = useFormattedPrice(date, price, currency_code);

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
				<LogoView slug={slug} emoji={emoji} name={customName || title} size={48} color={color} />
			</LogoSection>

			<DescSection>
				<H3 numberOfLines={1} ellipsizeMode="tail">
					{customName || title}
				</H3>

				<BottomText numberOfLines={1} ellipsizeMode="tail">
					{category_title || t(`default_categories.${category_slug}`)}
				</BottomText>
			</DescSection>

			<PriceSection $isSingle={!withConversion}>
				{withConversion ? (
					<LargeText numberOfLines={1} ellipsizeMode="tail" $weight={500} $align="right">
						{basePrice}
					</LargeText>
				) : (
					<H3 numberOfLines={1} ellipsizeMode="tail" $weight={500} $align="right">
						{basePrice}
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
