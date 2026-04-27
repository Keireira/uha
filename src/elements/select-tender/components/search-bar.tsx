import React from 'react';
import { Stack } from 'expo-router';

import { useAccent } from '@hooks';
// import { useTranslation } from 'react-i18next';

import type { TextInputChangeEvent } from 'react-native';

type Props = {
	setSearchQuery: (query: string) => void;
};

const SearchBar = ({ setSearchQuery }: Props) => {
	// const { t } = useTranslation();
	const settingAccent = useAccent();

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
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
				placeholder="Filter payment methods"
			/>
		</Stack.Toolbar>
	);
};

export default SearchBar;
