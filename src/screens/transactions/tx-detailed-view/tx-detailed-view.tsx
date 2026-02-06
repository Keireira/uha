import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'styled-components/native';

import logos from '@assets/logos';
import { useSettingsValue, useRates } from '@hooks';
import { useDateLabel, useTransaction, useUpdateComment } from './hooks';

import { SymbolView } from 'expo-symbols';
import { LogoView } from '@ui';
import Root, {
	AccentRail,
	AccentSegment,
	Content,
	PriceSection,
	PriceMain,
	PriceConverted,
	Rule,
	MerchantSection,
	MerchantInfo,
	MerchantName,
	DateRow,
	DateText,
	Label,
	MetaGrid,
	MetaItem,
	MetaValue,
	TenderRow,
	TenderEmoji,
	TenderDetails,
	TenderComment,
	NoteInput
} from './tx-detailed-view.styles';

import type { Props } from './tx-detailed-view.props';

const DetailedView = (transaction: Props) => {
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

	const [note, setNote] = useState(transaction.comment ?? '');
	const saveComment = useUpdateComment(transaction.id);

	useEffect(() => {
		setNote(transaction.comment ?? '');
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [transaction.id]);

	const handleBlur = useCallback(() => {
		const trimmed = note.trim();

		if (trimmed !== (transaction.comment ?? '')) {
			saveComment(trimmed);
		}
	}, [note, transaction.comment, saveComment]);

	return (
		<Root>
			<AccentRail>
				<AccentSegment $color={transaction.color || transaction.category_color} />
				<AccentSegment $color={transaction.category_color || transaction.color} />
			</AccentRail>

			<Content>
				<PriceSection $withConversion={transaction.currency_code !== recalcCurrencyCode}>
					<PriceMain numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
						{formattedBasePrice}
					</PriceMain>

					{transaction.currency_code !== recalcCurrencyCode && (
						<PriceConverted numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
							≈&nbsp;{convertedPrice}
						</PriceConverted>
					)}
				</PriceSection>

				<Rule />

				<MerchantSection>
					<LogoView
						logoId={logoUrl}
						emoji={transaction.emoji}
						name={transaction.customName || transaction.title}
						size={56}
						color={transaction.color}
					/>

					<MerchantInfo>
						<MerchantName numberOfLines={1} ellipsizeMode="tail">
							{transaction?.customName || transaction?.title}
						</MerchantName>

						<DateRow>
							{transaction.isPhantom && <SymbolView name="clock" tintColor={theme.accent.primary} size={14} />}

							<DateText numberOfLines={1} ellipsizeMode="tail">
								{dateLabel}
							</DateText>
						</DateRow>
					</MerchantInfo>
				</MerchantSection>

				<Rule />

				<MetaGrid>
					<MetaItem>
						<Label>{t('transactions.details.category')}</Label>

						<MetaValue numberOfLines={1} ellipsizeMode="tail">
							{transaction.category_title}
						</MetaValue>
					</MetaItem>

					{explainCurrency && (
						<MetaItem>
							<Label>{t('transactions.details.currency')}</Label>

							<MetaValue numberOfLines={1} ellipsizeMode="tail">
								{t(`currencies.${transaction.currency_code}`)}
							</MetaValue>
						</MetaItem>
					)}
				</MetaGrid>

				{transaction.tender_title && (
					<>
						<Rule />

						<MetaItem>
							<Label>{t('transactions.details.payment')}</Label>

							<TenderRow>
								<TenderEmoji>{transaction.tender_emoji}</TenderEmoji>

								<TenderDetails>
									<MetaValue numberOfLines={1} ellipsizeMode="tail">
										{transaction.tender_title}
									</MetaValue>

									{transaction.tender_comment && (
										<TenderComment numberOfLines={1} ellipsizeMode="tail">
											{transaction.tender_comment}
										</TenderComment>
									)}
								</TenderDetails>
							</TenderRow>
						</MetaItem>
					</>
				)}

				<Rule />

				<MetaItem>
					<Label>{t('transactions.details.notes')}</Label>

					<NoteInput
						value={note}
						onChangeText={setNote}
						onBlur={handleBlur}
						placeholder={t('transactions.details.notes_placeholder')}
						placeholderTextColor={theme.text.tertiary}
						multiline
						scrollEnabled={false}
						textAlignVertical="top"
					/>
				</MetaItem>
			</Content>
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
