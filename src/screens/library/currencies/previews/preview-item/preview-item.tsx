import React from 'react';
import { useTheme } from 'styled-components/native';

import Root, { SymbolWrapper, Symbol, Code, Region } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const REGION_LABELS: Record<string, string> = {
	europe: 'Europe',
	north_america: 'N. America',
	south_america: 'S. America',
	central_america: 'C. America',
	caribbean: 'Caribbean',
	africa: 'Africa',
	central_asia: 'C. Asia',
	south_asia: 'S. Asia',
	east_asia: 'E. Asia',
	southeast_asia: 'SE Asia',
	oceania: 'Oceania',
	cryptocurrency: 'Crypto',
	other: 'Other'
};

const PreviewItem = ({ id, symbol, region }: PropsT) => {
	const theme = useTheme();
	const label = region ? REGION_LABELS[region] || region : undefined;

	return (
		<Root>
			<SymbolWrapper tintColor={theme.accent.tertiary}>
				<Symbol>{symbol}</Symbol>
			</SymbolWrapper>

			<Code>{id}</Code>

			{label && <Region>{label}</Region>}
		</Root>
	);
};

export default React.memo(PreviewItem);
