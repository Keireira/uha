import React from 'react';
import { useTheme } from 'styled-components/native';

import { SymbolView } from 'expo-symbols';
import Root, { Inner, EmptyText } from './no-results.styles';

const NoResults = () => {
	const theme = useTheme();

	return (
		<Root>
			<Inner>
				<SymbolView name="magnifyingglass" size={42} tintColor={theme.text.secondary} />

				<EmptyText>No services has been found</EmptyText>
			</Inner>
		</Root>
	);
};

export default NoResults;
