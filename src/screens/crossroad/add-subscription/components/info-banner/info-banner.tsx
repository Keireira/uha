import React from 'react';
import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import { H5 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Inner, InnerPressable, Icon, TextBlock, Description } from './info-banner.styles';

import type { Props } from './info-banner.d';

const InfoBanner = ({ title, description, onPress }: Props) => {
	const settingAccent = useAccent();
	const isInteractive = Boolean(onPress);

	const inner = (
		<>
			<Icon $tintColor={settingAccent}>
				<SymbolView name="info" size={32} tintColor={settingAccent} weight="semibold" />
			</Icon>

			<TextBlock>
				<H5 $color={settingAccent}>{title}</H5>
				{description && <Description>{description}</Description>}
			</TextBlock>
		</>
	);

	return (
		<Root tintColor={withAlpha(settingAccent, 0.125)} isInteractive={isInteractive}>
			{isInteractive ? <InnerPressable onPress={onPress}>{inner}</InnerPressable> : <Inner>{inner}</Inner>}
		</Root>
	);
};

export default InfoBanner;
