import React from 'react';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';

import { useSettingsValue } from '@hooks';
import logos from '@assets/logos';

import { H1, H4, SmallText, LogoView } from '@ui';
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

const STUB_KZT_RATE = 514.1;

const TxDetailedView = () => {
	const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
	console.log('transactionId:', transactionId);
	const showFractions = useSettingsValue<boolean>('currency_fractions');

	// TODO: Fetch actual transaction data using transactionId
	// For now, using placeholder data structure
	const tx = {
		id: 'transactionId',
		currency: '$',
		denominator: 100,
		price: 1299,
		slug: 'spotify',
		title: 'Spotify',
		customName: null,
		emoji: null,
		color: '#1DB954',
		date: new Date().toISOString(),
		category_id: 1,
		category_title: 'Subscriptions',
		category_color: '#6d28d9',
		isPhantom: true
	};

	const logoUrl = tx.slug ? logos[tx.slug as keyof typeof logos] : null;
	const basePrice = tx.price / (tx.denominator || 1);
	const convertedPrice = (tx.price * STUB_KZT_RATE) / (tx.denominator || 1);
	const formattedDate = format(new Date(tx.date), 'EEEE, MMMM d, yyyy');

	return (
		<Root>
			{/* Hero Section with Large Logo and Amount */}
			<Animated.View entering={FadeIn.duration(300)}>
				<HeroSection>
					<LogoView logoId={logoUrl} emoji={tx.emoji} name={tx.customName || tx.title} size={80} color={tx.color} />

					<AmountContainer>
						<H1 $weight={800}>
							{tx.currency}
							{showFractions ? basePrice.toFixed(2) : Math.round(basePrice)}
						</H1>

						<ConvertedAmount>
							≈ {showFractions ? convertedPrice.toFixed(2) : Math.round(convertedPrice)} ₸
						</ConvertedAmount>
					</AmountContainer>

					<H4 $weight={600}>{tx.customName || tx.title}</H4>

					<CategoryPill $color={tx.category_color}>
						<SmallText $weight={600}>{tx.category_title}</SmallText>
					</CategoryPill>
				</HeroSection>
			</Animated.View>

			{/* Transaction Details Card */}
			<Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
				<DetailCard>
					<DetailRow>
						<DetailLabel>Status</DetailLabel>
						<StatusBadge $isPhantom={tx.isPhantom}>
							<StatusDot $isPhantom={tx.isPhantom} />
							<SmallText $weight={600}>{tx.isPhantom ? 'Planned' : 'Completed'}</SmallText>
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
