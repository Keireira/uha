import React, { useCallback, useRef } from 'react';
import { Stack, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useSearch } from '@screens/add/hooks';

import type { SearchBarCommands } from 'react-native-screens';

const Layout = () => {
	const { t } = useTranslation();
	const { runSearch } = useSearch();
	const searchBarRef = useRef<SearchBarCommands>(null);

	const focusSearchBar = useCallback(() => {
		if (!searchBarRef.current) return;

		searchBarRef.current?.focus();
	}, []);

	useFocusEffect(focusSearchBar);

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: t('crossroad.add.header'),
					headerTitleStyle: {
						color: 'transparent'
					},
					headerShown: true,
					headerTransparent: true,
					headerShadowVisible: false,
					headerSearchBarOptions: {
						ref: searchBarRef,
						hideNavigationBar: false,
						placeholder: t('crossroad.add.search_bar'),
						onChangeText: (e) => {
							runSearch(e.nativeEvent.text);
						}
					}
				}}
			/>
		</Stack>
	);
};

export default Layout;
