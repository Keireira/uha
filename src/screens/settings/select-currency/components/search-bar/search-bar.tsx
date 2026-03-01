import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import FloatingSearchBar from '@modules/floating-search-bar';

import type { Props } from './search-bar.d';

const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	const handleChangeText = (event: { nativeEvent: { text: string } }) => {
		setSearchQuery(event.nativeEvent.text);
	};

	return (
		<FloatingSearchBar
			value={searchQuery}
			placeholder={t('settings.currencies.search')}
			onChangeText={handleChangeText}
			tintColor={theme.accent.orange}
		/>
	);
};

export default SearchBar;
