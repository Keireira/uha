import React from 'react';

import { SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Inner } from './source-badge.styles';

import type { SourceT } from '@api/soup/soup.d';
import type { Props } from './source-badge.d';

const SOURCE_META = {
	local: {
		color: '#34C759',
		label: ''
	},
	brandfetch: {
		color: '#30D158',
		label: 'Brandfetch'
	},
	'logo.dev': {
		color: '#64D2FF',
		label: 'logo.dev'
	},
	unknown: {
		color: '#FF375F',
		label: 'unknown'
	}
} as const;

const SourceBadge = ({ source }: Props) => {
	const meta = SOURCE_META[source as SourceT] ?? SOURCE_META.unknown;

	if (source === 'local') {
		return <SymbolView name="checkmark.seal.fill" size={20} tintColor={meta.color} />;
	}

	return (
		<Root>
			<Inner $color={meta.color}>
				<SmallText $weight={600} $color={meta.color}>
					{meta.label}
				</SmallText>
			</Inner>
		</Root>
	);
};

export default SourceBadge;
