import React from 'react';
import { useTheme } from 'styled-components/native';

import { SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Inner } from './source-badge.styles';

import type { SourceT } from '@api/soup/soup.d';
import type { Props } from './source-badge.d';

const SOURCE_META = {
	inhouse: {
		color_slug: 'green',
		label: ''
	},
	appstore: {
		color_slug: 'blue',
		label: 'App Store'
	},
	playstore: {
		color_slug: 'green',
		label: 'Google Play'
	},
	web: {
		color_slug: 'orange',
		label: 'Web'
	},
	brandfetch: {
		color_slug: 'purple',
		label: 'Brandfetch'
	},
	logodev: {
		color_slug: 'mint',
		label: 'logo.dev'
	},
	unknown: {
		color_slug: 'pink',
		label: 'unknown'
	}
} as const;

const SourceBadge = ({ source }: Props) => {
	const theme = useTheme();
	const meta = SOURCE_META[source as SourceT] ?? SOURCE_META.unknown;
	const color = theme.accents[meta.color_slug];

	if (source === 'inhouse') {
		return <SymbolView name="checkmark.seal.fill" size={20} tintColor={color} />;
	}

	return (
		<Root>
			<Inner $color={color}>
				<SmallText $weight={600} $color={color}>
					{meta.label}
				</SmallText>
			</Inner>
		</Root>
	);
};

export default SourceBadge;
