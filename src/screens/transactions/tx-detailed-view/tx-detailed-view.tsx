import React from 'react';
import { first } from '@lib';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';

import db from '@db';
import { sql, gt, eq } from 'drizzle-orm';
import {
	transactionsTable,
	currenciesTable,
	servicesTable,
	subscriptionsTable,
	categoriesTable,
	tendersTable
} from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import logos from '@assets/logos';
import { useSettingsValue } from '@hooks';

import { H1, Text, H4, SmallText, LogoView } from '@ui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import {
	Root,
	HeroSection,
	AmountContainer,
	CurrencyBadge,
	DetailCard,
	DetailRow,
	DetailLabel,
	DetailValue,
	CategoryPill,
	Divider,
	ConvertedAmount,
	StatusBadge,
	StatusDot
} from './tx-detailed-view.styles';

import type { PreparedDbTxT } from '@hooks/use-transactions';

const STUB_KZT_RATE = 514.1;

const useTransaction = (): PreparedDbTxT | undefined => {
	const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

	const { data: transaction } = useLiveQuery(
		db
			.select({
				id: transactionsTable.id,
				currency: currenciesTable.symbol,
				denominator: currenciesTable.denominator,
				price: transactionsTable.amount,
				slug: servicesTable.slug,
				title: servicesTable.title,
				customName: subscriptionsTable.custom_name,
				emoji: categoriesTable.emoji,
				color: servicesTable.color,
				date: transactionsTable.date,
				isPhantom: gt(transactionsTable.date, sql`date('now')`),

				/* category-related fields */
				category_id: categoriesTable.id,
				category_title: categoriesTable.title,
				category_color: categoriesTable.color
			})
			.from(transactionsTable)
			.innerJoin(currenciesTable, eq(transactionsTable.currency_id, currenciesTable.id))
			.innerJoin(subscriptionsTable, eq(transactionsTable.subscription_id, subscriptionsTable.id))
			.innerJoin(servicesTable, eq(subscriptionsTable.service_id, servicesTable.id))
			.innerJoin(categoriesTable, eq(servicesTable.category_id, categoriesTable.id))
			.leftJoin(tendersTable, eq(transactionsTable.tender_id, tendersTable.id))
			.where(eq(transactionsTable.id, transactionId))
	);

	return first(transaction);
};

const TxDetailedView = () => {
	const transaction = useTransaction();
	const showFractions = useSettingsValue<boolean>('currency_fractions');

	if (!transaction) {
		return (
			<Root>
				<Animated.View entering={FadeIn.duration(300)}>
					<HeroSection>
						<LogoView emoji="❌" size={80} />

						<H1>Transaction not found</H1>

						<CategoryPill $color="red">
							<Text>This is a phantom transaction</Text>
						</CategoryPill>
					</HeroSection>
				</Animated.View>
			</Root>
		);
	}

	const logoUrl = transaction.slug ? logos[transaction.slug as keyof typeof logos] : null;
	const basePrice = transaction.price / (transaction.denominator || 1);
	const convertedPrice = (transaction.price * STUB_KZT_RATE) / (transaction.denominator || 1);
	const formattedDate = format(new Date(transaction.date), 'EEEE, MMMM d, yyyy');

	return (
		<Root>
			<Animated.View entering={FadeIn.duration(300)}>
				<HeroSection>
					<LogoView
						logoId={logoUrl}
						emoji={transaction.emoji}
						name={transaction.customName || transaction.title}
						size={80}
						color={transaction.color}
					/>

					<AmountContainer>
						<H1 $weight={800}>
							{transaction.currency}
							{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
						</H1>

						<ConvertedAmount>
							≈ {showFractions ? convertedPrice.toFixed(2) : Math.round(convertedPrice)} ₸
						</ConvertedAmount>
					</AmountContainer>

					<H4 $weight={600}>{transaction.customName || transaction.title}</H4>

					<CategoryPill $color={transaction.category_color}>
						<SmallText $weight={600}>{transaction.category_title}</SmallText>
					</CategoryPill>
				</HeroSection>
			</Animated.View>

			<Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
				<DetailCard>
					<DetailRow>
						<DetailLabel>Status</DetailLabel>
						<StatusBadge $isPhantom={transaction.isPhantom}>
							<StatusDot $isPhantom={transaction.isPhantom} />
							<SmallText $weight={600}>{transaction.isPhantom ? 'Planned' : 'Completed'}</SmallText>
						</StatusBadge>
					</DetailRow>

					<Divider />

					<DetailRow>
						<DetailLabel>Date</DetailLabel>
						<DetailValue>{formattedDate}</DetailValue>
					</DetailRow>

					<Divider />

					<DetailRow>
						<DetailLabel>Base Currency</DetailLabel>
						<CurrencyBadge>
							<SmallText $weight={600}>USD</SmallText>
						</CurrencyBadge>
					</DetailRow>
				</DetailCard>
			</Animated.View>
		</Root>
	);
};

export default TxDetailedView;
