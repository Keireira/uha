import React from 'react';

import logos from '@assets/logos';
import { LogoView, Divider, AccentRail } from '@ui';
import { useService } from './use-service';
import { formatPrice, formatCycle } from '../../format';

import Root, {
	Content,
	HeroSection,
	LogoWrapper,
	HeroTitle,
	CategoryBadge,
	CategoryEmoji,
	CategoryName,
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

const ServiceDetail = () => {
	const { service, subscriptions } = useService();

	if (!service) return null;

	const logoUrl = service.slug ? logos[service.slug as keyof typeof logos] : null;

	return (
		<Root>
			<AccentRail
				segments={[
					{ color: service.color, flex: 3 },
					{ color: service.category_color, flex: 2 }
				]}
			/>

			<Content>
				<HeroSection>
					<LogoWrapper $color={service.color}>
						<LogoView name={service.title} logoId={logoUrl} color={service.color} size={56} />
					</LogoWrapper>

					<HeroTitle>{service.title}</HeroTitle>

					<CategoryBadge>
						<CategoryEmoji>{service.category_emoji}</CategoryEmoji>
						<CategoryName>{service.category_title}</CategoryName>
					</CategoryBadge>
				</HeroSection>

				<Divider />

				<LabelRow>
					<Label>SUBSCRIPTIONS</Label>
					<CountBadge>{subscriptions.length}</CountBadge>
				</LabelRow>

				{subscriptions.length === 0 ? (
					<EmptyHint>No subscriptions yet</EmptyHint>
				) : (
					subscriptions.map((sub) => (
						<SubscriptionRow key={sub.id}>
							<SubscriptionInfo>
								<SubscriptionName numberOfLines={1}>{sub.custom_name || service.title}</SubscriptionName>
								{sub.tender_title && (
									<SubscriptionMeta numberOfLines={1}>
										{sub.tender_emoji} {sub.tender_title}
									</SubscriptionMeta>
								)}
							</SubscriptionInfo>

							<SubscriptionPrice>
								{formatPrice(sub.current_price, sub.denominator, sub.intl_locale, sub.currency_code)}
								{formatCycle(sub.billing_cycle_type, sub.billing_cycle_value)}
							</SubscriptionPrice>
						</SubscriptionRow>
					))
				)}
			</Content>
		</Root>
	);
};

export default ServiceDetail;
