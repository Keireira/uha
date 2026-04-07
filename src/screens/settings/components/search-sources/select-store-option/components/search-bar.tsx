import React from 'react';
import { Stack } from 'expo-router';

import { useSettingsValue } from '@hooks';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import type { AccentT } from '@themes';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

type Props = {
	setSearchQuery: (query: string) => void;
};

const SearchBar = ({ setSearchQuery }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useSettingsValue<AccentT>('accent');

	const handleChangeText = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setSearchQuery(e.nativeEvent.text);
	};

	return (
		<Stack.Toolbar placement="bottom">
			<Stack.SearchBar
				autoFocus
				inputType="text"
				autoCapitalize="none"
				hideNavigationBar={false}
				onChangeText={handleChangeText}
				tintColor={theme.accents[settingAccent]}
				placeholder={t('settings.sources.search')}
			/>
		</Stack.Toolbar>
	);
};

export default SearchBar;
