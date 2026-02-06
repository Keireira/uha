import React from 'react';

import logos from '@assets/logos';
import { LogoView } from '@ui';
import { usePayment } from './use-payment';
import { formatPrice, formatCycle } from '../../format';

import Root, {
	HeroSection,
	HeroRing,
	HeroGlass,
	HeroEmoji,
	HeroTitle,
	HeroComment,
	MetaGrid,
	MetaItem,
	MetaValue,
	Rule,
	Label,
	CountBadge,
	LabelRow,
	SubscriptionRow,
	SubscriptionInfo,
	SubscriptionName,
	SubscriptionMeta,
	SubscriptionPrice,
	EmptyHint
} from './detail.styles';

const PaymentDetail = () => {
	const { payment, subscriptions } = usePayment();

	if (!payment) return null;

	return (
		<Root>
			<HeroSection>
				<HeroRing $color={payment.color}>
					<HeroGlass tintColor={payment.color}>
						<HeroEmoji>{payment.emoji}</HeroEmoji>
					</HeroGlass>
				</HeroRing>

				<HeroTitle>{payment.title}</HeroTitle>

				{payment.comment ? <HeroComment>{payment.comment}</HeroComment> : null}
			</HeroSection>

			<Rule />

			<MetaGrid>
				<MetaItem>
					<Label>TYPE</Label>
					<MetaValue>{payment.is_card ? 'Card' : 'Other'}</MetaValue>
				</MetaItem>
			</MetaGrid>

			<Rule />

			<LabelRow>
				<Label>SUBSCRIPTIONS</Label>
				<CountBadge>{subscriptions.length}</CountBadge>
			</LabelRow>

			{subscriptions.length === 0 ? (
				<EmptyHint>No subscriptions yet</EmptyHint>
			) : (
				subscriptions.map((sub) => {
					const logoUrl = sub.service_slug ? logos[sub.service_slug as keyof typeof logos] : null;

					return (
						<SubscriptionRow key={sub.id}>
							<LogoView name={sub.service_title} logoId={logoUrl} color={sub.service_color} size={36} />

							<SubscriptionInfo>
								<SubscriptionName numberOfLines={1}>{sub.custom_name || sub.service_title}</SubscriptionName>
								<SubscriptionMeta numberOfLines={1}>
									{sub.category_emoji} {sub.category_title}
								</SubscriptionMeta>
							</SubscriptionInfo>

							<SubscriptionPrice>
								{formatPrice(sub.current_price, sub.denominator, sub.intl_locale, sub.currency_code)}
								{formatCycle(sub.billing_cycle_type, sub.billing_cycle_value)}
							</SubscriptionPrice>
						</SubscriptionRow>
					);
				})
			)}
		</Root>
	);
};

export default PaymentDetail;
