import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SymbolView } from 'expo-symbols';

import { CircleButton } from '@ui';
import { useEntitlement } from '@hooks';
import usePaywall from './use-paywall';

import {
	Container,
	ScrollContent,
	Header,
	Title,
	Subtitle,
	FeatureList,
	FeatureRow,
	FeatureText,
	PriceCards,
	PriceCard,
	PriceCardInner,
	PriceCardLabel,
	PriceCardPrice,
	PriceCardPeriod,
	BestValueBadge,
	BestValueText,
	ActionArea,
	SubscribeButton,
	SubscribeButtonInner,
	SubscribeButtonText,
	RestoreButton,
	RestoreText,
	FooterNote
} from './paywall.styles';

const FEATURES = [
	'paywall.features.subscriptions',
	'paywall.features.currencies',
	'paywall.features.horizon',
	'paywall.features.first_day',
	'paywall.features.ai_premium'
] as const;

type PlanId = 'monthly' | 'annual' | 'lifetime';

const PaywallScreen = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isUnlimited } = useEntitlement();
	const { monthly, annual, lifetime, isLoading, purchasing, purchase, restore } = usePaywall();

	const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');

	if (isUnlimited) {
		router.back();
		return null;
	}

	const handleSubscribe = () => {
		const pkg = selectedPlan === 'monthly' ? monthly : selectedPlan === 'annual' ? annual : lifetime;
		if (pkg) purchase(pkg);
	};

	const isBusy = purchasing !== null;

	return (
		<Container style={{ paddingTop: insets.top }}>
			<Header>
				<Title>{t('paywall.title')}</Title>
				<CircleButton systemImage="xmark" onPress={() => router.back()} />
			</Header>

			<ScrollContent contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
				<Subtitle>{t('paywall.subtitle')}</Subtitle>

				<FeatureList>
					{FEATURES.map((key) => (
						<FeatureRow key={key}>
							<SymbolView name="checkmark.circle.fill" size={22} tintColor={theme.accent.orange} />
							<FeatureText>{t(key)}</FeatureText>
						</FeatureRow>
					))}
				</FeatureList>

				{isLoading ? (
					<ActivityIndicator color={theme.accent.orange} style={{ marginVertical: 32 }} />
				) : (
					<>
						<PriceCards>
							{monthly && (
								<PriceCard $active={selectedPlan === 'monthly'}>
									<PriceCardInner onPress={() => setSelectedPlan('monthly')}>
										<PriceCardLabel>{t('paywall.monthly')}</PriceCardLabel>
										<PriceCardPrice>{monthly.product.priceString}</PriceCardPrice>
										<PriceCardPeriod>/{t('paywall.monthly').toLowerCase()}</PriceCardPeriod>
									</PriceCardInner>
								</PriceCard>
							)}

							{annual && (
								<PriceCard $active={selectedPlan === 'annual'}>
									<PriceCardInner onPress={() => setSelectedPlan('annual')}>
										<BestValueBadge>
											<BestValueText>{t('paywall.best_value')}</BestValueText>
										</BestValueBadge>
										<PriceCardLabel>{t('paywall.annual')}</PriceCardLabel>
										<PriceCardPrice>{annual.product.priceString}</PriceCardPrice>
										<PriceCardPeriod>/{t('paywall.annual').toLowerCase()}</PriceCardPeriod>
									</PriceCardInner>
								</PriceCard>
							)}

							{lifetime && (
								<PriceCard $active={selectedPlan === 'lifetime'}>
									<PriceCardInner onPress={() => setSelectedPlan('lifetime')}>
										<PriceCardLabel>{t('paywall.lifetime')}</PriceCardLabel>
										<PriceCardPrice>{lifetime.product.priceString}</PriceCardPrice>
										<PriceCardPeriod> </PriceCardPeriod>
									</PriceCardInner>
								</PriceCard>
							)}
						</PriceCards>

						<ActionArea>
							<SubscribeButton>
								<SubscribeButtonInner onPress={handleSubscribe} disabled={isBusy}>
									{isBusy && purchasing !== 'restore' ? (
										<ActivityIndicator color="#ffffff" />
									) : (
										<SubscribeButtonText>{t('paywall.subscribe')}</SubscribeButtonText>
									)}
								</SubscribeButtonInner>
							</SubscribeButton>

							<RestoreButton onPress={restore} disabled={isBusy}>
								{purchasing === 'restore' ? (
									<ActivityIndicator color={theme.text.secondary} />
								) : (
									<RestoreText>{t('paywall.restore')}</RestoreText>
								)}
							</RestoreButton>
						</ActionArea>
					</>
				)}

				<FooterNote>{t('paywall.ai_note')}</FooterNote>
			</ScrollContent>
		</Container>
	);
};

export default PaywallScreen;
