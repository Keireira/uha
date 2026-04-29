import React from 'react';

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

	const categoryColor = category.color ?? '#333333';

	return (
		<Root>
			<HeroSection>
				<HeroRing $color={categoryColor}>
					<HeroGlass tintColor={categoryColor}>
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
					return (
						<SubscriptionRow key={sub.id}>
							<LogoView
								name={sub.service_title}
								url={sub.service_symbol ? undefined : sub.service_logo_url}
								slug={sub.service_symbol ? null : sub.service_slug}
								symbolName={sub.service_symbol as React.ComponentProps<typeof LogoView>['symbolName']}
								color={sub.service_color}
								size={36}
							/>

							<SubscriptionInfo>
								<SubscriptionName numberOfLines={1}>{sub.custom_name || sub.service_title}</SubscriptionName>
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
					);
				})
			)}
		</Root>
	);
};

export default CategoryDetail;
