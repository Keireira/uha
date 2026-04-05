import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { SymbolView } from 'expo-symbols';
import Root, { Inner, EmptyText } from './no-results.styles';

const NoResults = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Root>
			<Inner>
				<SymbolView name="magnifyingglass" size={42} tintColor={theme.text.secondary} />

				<EmptyText>{t('crossroad.add.no_results')}</EmptyText>
			</Inner>
		</Root>
	);
};

export default NoResults;
