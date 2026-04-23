import React from 'react';
import { useAccent } from '@hooks';
import { useLocalSearchParams } from 'expo-router';

import { H5 } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { TextBlock, Description } from './picker-banner.styles';

import type { Props } from './picker-banner.d';

const PickerBanner = ({ title, description }: Props) => {
	const settingAccent = useAccent();
	const { from } = useLocalSearchParams<{ from?: string }>();

	if (from !== 'timeline') {
		return null;
	}

	return (
		<Root $tintColor={settingAccent}>
			<SymbolView
				name="point.topright.filled.arrow.triangle.backward.to.point.bottomleft.scurvepath"
				size={36}
				tintColor={settingAccent}
				weight="semibold"
			/>

			<TextBlock>
				<H5 $color={settingAccent}>{title}</H5>
				{description && <Description>{description}</Description>}
			</TextBlock>
		</Root>
	);
};

export default PickerBanner;
