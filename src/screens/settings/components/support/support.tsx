import React from 'react';
import { Linking } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { useEntitlement, useTipJar, useAccent } from '@hooks';

import { H6, SmallText } from '@ui';
import Root, { Pill, Inner } from './support.styles';

const EXTERNAL_SUPPORT = [
	{ type: 'github', username: 'keireira', url: 'https://github.com/sponsors/Keireira' },
	{ type: 'boosty', username: 'keireira', url: 'https://boosty.to/keireira/donate' },
	{ type: 'patreon', username: 'keireira_fog', url: 'https://patreon.com/keireira_fog' }
];

const Support = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const accentColor = useAccent();
	const { isUnlimited } = useEntitlement();
	const { products: tipProducts, purchasing: isPurchasing, purchaseTip } = useTipJar();

	return (
		<>
			{isUnlimited && tipProducts.length > 0 && (
				<Root>
					{tipProducts.map((product) => {
						const purchase = () => purchaseTip(product);
						const title = t(`settings.tip_jar.${product.identifier}`) || product.title;

						return (
							<Pill key={product.identifier} $color={accentColor}>
								<Inner onPress={purchase} disabled={Boolean(isPurchasing)}>
									<H6 $color={accentColor}>{product.priceString}</H6>

									<SmallText $color={theme.text.secondary}>{title}</SmallText>
								</Inner>
							</Pill>
						);
					})}
				</Root>
			)}

			<Root>
				{EXTERNAL_SUPPORT.map((unit) => {
					const openLink = () => Linking.openURL(unit.url);

					return (
						<Pill key={unit.type} $color={accentColor}>
							<Inner onPress={openLink}>
								<H6 $color={accentColor}>{t(`settings.donations.${unit.type}`)}</H6>

								<SmallText $color={theme.text.secondary}>{unit.username}</SmallText>
							</Inner>
						</Pill>
					);
				})}
			</Root>
		</>
	);
};

export default Support;
