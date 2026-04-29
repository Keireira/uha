import React from 'react';

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

	return (
		<Root>
			<AccentRail
				segments={[
					{ color: service.color, flex: 3 },
					{ color: service.category_color ?? service.color, flex: 2 }
				]}
			/>

			<Content>
				<HeroSection>
					<LogoWrapper $color={service.color}>
						<LogoView
							name={service.title}
							url={service.symbol ? undefined : service.logo_url}
							slug={service.symbol ? null : service.slug}
							symbolName={service.symbol as React.ComponentProps<typeof LogoView>['symbolName']}
							color={service.color}
							size={56}
						/>
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
								{formatPrice(
									sub.current_price ?? 0,
									sub.denominator ?? 1,
									sub.intl_locale ?? 'en-US',
									sub.currency_code ?? 'USD'
								)}
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
