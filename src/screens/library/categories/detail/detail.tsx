import React from 'react';

import logos from '@assets/logos';
import { LogoView, Divider } from '@ui';
import { useCategory } from './use-category';
import { formatPrice, formatCycle } from '../../format';

import Root, {
	HeroSection,
	HeroRing,
	HeroGlass,
	HeroEmoji,
	HeroTitle,
	Label,
	CountBadge,
	LabelRow,
	SubscriptionRow,
	SubscriptionInfo,
	SubscriptionName,
	SubscriptionPrice,
	EmptyHint
} from './detail.styles';

const CategoryDetail = () => {
	const { category, subscriptions } = useCategory();

	if (!category) return null;

	return (
		<Root>
			<HeroSection>
				<HeroRing $color={category.color}>
					<HeroGlass tintColor={category.color}>
						<HeroEmoji>{category.emoji}</HeroEmoji>
					</HeroGlass>
				</HeroRing>

				<HeroTitle>{category.title}</HeroTitle>
			</HeroSection>

			<Divider />

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

export default CategoryDetail;
