import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'styled-components/native';

import { darken } from '@lib';
import logos from '@assets/logos';
import { useSettingsValue, useRates } from '@hooks';
import { useDateLabel, useTransaction } from './hooks';

import { SymbolView } from 'expo-symbols';
import { H3, H6, Text, LogoView } from '@ui';
import Root, { Header, HeadDetails, Section, SectionItem, Title, Tags, Tag } from './tx-detailed-view.styles';

const DetailedView = (transaction) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const explainCurrency = useSettingsValue<boolean>('explain_currency');
	const recalcCurrencyCode = useSettingsValue<string>('recalc_currency_code');
	const { r, formatCurrency } = useRates(transaction.date, transaction.isPhantom, transaction.currency_code);

	const basePrice = transaction.price / (transaction.denominator || 1);
	const formattedBasePrice = formatCurrency(basePrice, transaction.currency_code);
	const convertedPrice = r(basePrice);

	const dateLabel = useDateLabel(transaction.date);
	const logoUrl = transaction.slug ? logos[transaction.slug as keyof typeof logos] : null;

	return (
		<Root>
			<Header>
				<LogoView
					logoId={logoUrl}
					emoji={transaction.emoji}
					name={transaction.customName || transaction.title}
					size={64}
					color={transaction.color}
				/>

				<HeadDetails>
					<H3 numberOfLines={1} ellipsizeMode="tail">
						{transaction?.customName || transaction?.title}
					</H3>

					<Title>
						{transaction.isPhantom && <SymbolView name="clock" tintColor={theme.accent.primary} size={18} />}

						<Text $color={theme.text.secondary} numberOfLines={1} ellipsizeMode="tail">
							{dateLabel}
						</Text>
					</Title>
				</HeadDetails>
			</Header>

			<Tags>
				<Tag $color={transaction.category_color}>
					<Text $color={darken(transaction.category_color, 25)} numberOfLines={1} ellipsizeMode="tail" $weight={700}>
						{transaction.category_title}
					</Text>
				</Tag>

				{explainCurrency && (
					<Tag $color={theme.accent.tertiary}>
						<Text $color={theme.accent.tertiary} numberOfLines={1} ellipsizeMode="tail" $weight={700}>
							{t(`currencies.${transaction.currency_code}`)}
						</Text>
					</Tag>
				)}
			</Tags>

			<Section>
				<SectionItem>
					<H6 $color={theme.text.tertiary} $weight={500}>
						RAW AMOUNT
					</H6>

					<H3 numberOfLines={1} ellipsizeMode="tail">
						{formattedBasePrice}
					</H3>
				</SectionItem>

				{transaction.currency_code !== recalcCurrencyCode && (
					<SectionItem>
						<H6 $color={theme.text.tertiary} $weight={500}>
							RE-CALCED
						</H6>

						<H3 numberOfLines={1} ellipsizeMode="tail">
							{transaction.isPhantom ? '≈' : '='}
							{convertedPrice}
						</H3>
					</SectionItem>
				)}
			</Section>

			<Section>
				<H6 $color={theme.text.tertiary} $weight={500}>
					via {transaction.tender_title}
				</H6>

				<Text>{transaction.tender_comment}</Text>
			</Section>

			<Section>
				<H6 $color={theme.text.tertiary} $weight={500}>
					NOTES
				</H6>

				<Text>{transaction.comment}</Text>
			</Section>
		</Root>
	);
};

const NoTransaction = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Root>
			<Header>
				<LogoView emoji="❌" size={64} color={theme.accent.primary} />

				<HeadDetails>
					<H3 numberOfLines={1} ellipsizeMode="tail">
						{t('transactions.details.not_found')}
					</H3>
				</HeadDetails>
			</Header>
		</Root>
	);
};

const TxDetailedView = () => {
	const transaction = useTransaction();

	if (!transaction) {
		return <NoTransaction />;
	}

	return <DetailedView {...transaction} date={new Date(transaction.date)} />;
};

export default TxDetailedView;
