import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { Text } from '@ui';
import Root from './no-filters.styles';

const NoFilters = () => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Root>
			<Text $color={theme.text.tertiary}>{t('transactions.filters.empty')}</Text>
		</Root>
	);
};

export default NoFilters;
