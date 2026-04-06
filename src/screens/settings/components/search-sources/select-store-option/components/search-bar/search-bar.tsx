import React from 'react';
import { useSettingsValue } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import FloatingSearchBar from '@modules/floating-search-bar';

import type { AccentT } from '@themes';
import type { Props } from './search-bar.d';

const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useSettingsValue<AccentT>('accent');

	const handleChangeText = (event: { nativeEvent: { text: string } }) => {
		setSearchQuery(event.nativeEvent.text);
	};

	return (
		<FloatingSearchBar
			value={searchQuery}
			placeholder={t('settings.sources.search')}
			onChangeText={handleChangeText}
			tintColor={theme.accents[settingAccent]}
		/>
	);
};

export default SearchBar;
