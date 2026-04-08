import React from 'react';
import { Stack } from 'expo-router';

import { useAccent } from '@hooks';
import { useTranslation } from 'react-i18next';

import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

type Props = {
	setSearchQuery: (query: string) => void;
};

const SearchBar = ({ setSearchQuery }: Props) => {
	const { t } = useTranslation();
	const settingAccent = useAccent();

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
				tintColor={settingAccent}
				placeholder={t('settings.sources.search')}
			/>
		</Stack.Toolbar>
	);
};

export default SearchBar;
