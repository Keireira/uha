import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'styled-components/native';

import { darken } from '@lib';
import logos from '@assets/logos';
import { useSettingsValue, useRates } from '@hooks';
import { useDateLabel, useTransaction } from './hooks';

import { SymbolView } from 'expo-symbols';
import { Divider } from '@expo/ui/swift-ui';
import { H2, H6, LargeText, Text, LogoView } from '@ui';
import Root, {
	Header,
	HeadDetails,
	Section,
	SectionItem,
	Title,
	DividerHost,
	Prices,
	BasePrice,
	ConvertedPrice,
	Tags,
	Tag,
	TenderWrap,
	TenderLogo,
	TenderInfo,
	TenderTitle,
	TenderComment
} from './tx-detailed-view.styles';

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
			{/* Header section */}
			<Header>
				<LogoView
					logoId={logoUrl}
					emoji={transaction.emoji}
					name={transaction.customName || transaction.title}
					size={80}
					color={transaction.color}
				/>

				<HeadDetails>
					<H2 numberOfLines={1} ellipsizeMode="tail">
						{transaction?.customName || transaction?.title}
					</H2>

					<Title>
						{transaction.isPhantom && <SymbolView name="clock" tintColor={theme.accent.primary} size={18} />}

						<Text $color={theme.text.secondary} numberOfLines={1} ellipsizeMode="tail">
							{dateLabel}
						</Text>
					</Title>
				</HeadDetails>
			</Header>

			{/* Tags section */}
			<Tags>
				<Tag $color={transaction.category_color}>
					<Text $color={darken(transaction.category_color, 25)} $weight={700} numberOfLines={1} ellipsizeMode="tail">
						{transaction.category_title}
					</Text>
				</Tag>

				{explainCurrency && (
					<Tag $color={theme.accent.tertiary}>
						<Text $color={theme.accent.tertiary} $weight={700} numberOfLines={1} ellipsizeMode="tail">
							{t(`currencies.${transaction.currency_code}`)}
						</Text>
					</Tag>
				)}
			</Tags>

			{/* Divider section */}
			<DividerHost>
				<Divider />
			</DividerHost>

			{/* Price section */}
			<Prices>
				<BasePrice numberOfLines={1} ellipsizeMode="tail">
					{formattedBasePrice}
				</BasePrice>

				{transaction.currency_code !== recalcCurrencyCode && (
					<ConvertedPrice numberOfLines={1} ellipsizeMode="tail">
						≈&nbsp;{convertedPrice}
					</ConvertedPrice>
				)}
			</Prices>

			{/* Tender section */}
			{transaction.tender_title && (
				<TenderWrap>
					<TenderLogo>
						<LargeText>{transaction.tender_emoji}</LargeText>
					</TenderLogo>

					<TenderInfo>
						<TenderTitle>via {transaction.tender_title}</TenderTitle>
						{transaction.tender_comment && <TenderComment>{transaction.tender_comment}</TenderComment>}
					</TenderInfo>
				</TenderWrap>
			)}

			{/* Notes section */}
			<Section>
				<SectionItem>
					<H6 $color={theme.text.tertiary}>NOTES</H6>

					<Text>{transaction.comment}</Text>
				</SectionItem>
			</Section>
		</Root>
	);
};

const TxDetailedView = () => {
	const transaction = useTransaction();

	if (!transaction) {
		return null;
	}

	return <DetailedView {...transaction} date={new Date(transaction.date)} />;
};

export default TxDetailedView;
